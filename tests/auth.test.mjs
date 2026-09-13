import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import ts from "typescript";
import * as ssr from "@insforge/sdk/ssr";
import * as middleware from "@insforge/sdk/ssr/middleware";

const require = createRequire(import.meta.url);
const { NextRequest, NextResponse } = require("next/server");
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const user = { id: "test-user", email: "test@example.invalid", profile: { name: "Test User" } };
const token = (exp, marker = "test") => `${Buffer.from('{"alg":"HS256"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: user.id, exp, marker })).toString("base64url")}.test-signature`;
const accessToken = token(Math.floor(Date.now() / 1000) + 3600);
const refreshToken = token(Math.floor(Date.now() / 1000) + 86400, "refresh");
const expiredToken = token(1);
let jar;
let calls;
let backend;
let modules;

function redirect(destination) {
  const error = new Error("NEXT_REDIRECT");
  error.destination = destination;
  throw error;
}

// Compile the real application modules with only Next's request context replaced.
// SDK calls, cookies, HTTP responses, PKCE generation, and proxy refresh remain real.
function load(relative) {
  const file = resolve(relative);
  if (modules.has(file)) return modules.get(file).exports;
  const compiledModule = { exports: {} };
  modules.set(file, compiledModule);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const dependencies = {
    "server-only": {},
    "@insforge/sdk/ssr": ssr,
    "@insforge/sdk/ssr/middleware": middleware,
    "next/headers": { cookies: async () => jar },
    "next/navigation": { redirect },
    "next/cache": { revalidatePath: () => {} },
    react: { cache: (fn) => fn },
  };
  const localRequire = (name) => name.startsWith("@/")
    ? load(`${name.slice(2)}.ts`)
    : Object.hasOwn(dependencies, name) ? dependencies[name] : require(name);
  new Function("require", "module", "exports", code)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

beforeEach(() => {
  process.env.APP_URL = "http://localhost:3000";
  process.env.NEXT_PUBLIC_INSFORGE_URL = "https://backend.example.invalid";
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY = "test-public-key";
  process.env.NODE_ENV = "production";
  jar = NextResponse.next().cookies;
  calls = [];
  modules = new Map();
  backend = () => Response.json({ user, accessToken, refreshToken });
  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === "string" ? input : input.url ?? input);
    assert.equal(url.origin, "https://backend.example.invalid");
    calls.push({ url, init });
    return backend(url, init);
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const name of ["APP_URL", "NEXT_PUBLIC_INSFORGE_URL", "NEXT_PUBLIC_INSFORGE_ANON_KEY", "NODE_ENV"]) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
});

test("OAuth start validates provider and stores a secure, short-lived PKCE verifier", async () => {
  const { signIn } = load("actions/auth.ts");
  const form = new FormData();
  form.set("provider", "attacker");
  assert.equal((await signIn({ success: false }, form)).success, false);
  assert.equal(calls.length, 0);
  backend = () => Response.json({ authUrl: "https://accounts.google.com/o/oauth2/v2/auth" });
  form.set("provider", "google");
  await assert.rejects(signIn({ success: false }, form), (error) => error.destination?.startsWith("https://accounts.google.com/"));
  const verifier = jar.get("apply_copilot_oauth_verifier");
  assert.equal(verifier.httpOnly, true);
  assert.equal(verifier.secure, true);
  assert.equal(verifier.sameSite, "lax");
  assert.equal(verifier.maxAge, 600);
  assert.equal(verifier.path, "/api/auth/callback");
  assert.equal(calls[0].url.searchParams.get("redirect_uri"), "http://localhost:3000/api/auth/callback");
  assert.ok(calls[0].url.searchParams.get("code_challenge"));
});

test("callback refuses missing verifier and never follows a supplied external next URL", async () => {
  const { completeOAuth } = load("lib/auth-http.ts");
  const response = await completeOAuth(new NextRequest("http://localhost:3000/api/auth/callback?insforge_code=test&next=https://attacker.invalid"));
  assert.equal(response.headers.get("location"), "http://localhost:3000/login?error=oauth");
  assert.equal(calls.length, 0);
  assert.equal(response.cookies.get("apply_copilot_oauth_verifier").maxAge, 0);
});

test("callback exchanges code with PKCE and sets session cookies on the dashboard redirect", async () => {
  const { completeOAuth } = load("lib/auth-http.ts");
  const request = new NextRequest("http://localhost:3000/api/auth/callback?insforge_code=test&next=https://attacker.invalid", {
    headers: { cookie: "apply_copilot_oauth_verifier=test-verifier" },
  });
  const response = await completeOAuth(request);
  assert.equal(response.headers.get("location"), "http://localhost:3000/dashboard");
  assert.equal(response.cookies.get("insforge_refresh_token").httpOnly, true);
  assert.equal(response.cookies.get("insforge_refresh_token").secure, true);
  assert.equal(response.cookies.get("insforge_access_token").value, accessToken);
  assert.equal(response.cookies.get("apply_copilot_oauth_verifier").maxAge, 0);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(JSON.parse(calls[0].init.body), { code: "test", code_verifier: "test-verifier" });
});

test("invalid callback clears the verifier and returns a generic error without session cookies", async () => {
  backend = () => Response.json({ error: "INVALID_CODE", message: "private backend details", statusCode: 400 }, { status: 400 });
  const { completeOAuth } = load("lib/auth-http.ts");
  const response = await completeOAuth(new NextRequest("http://localhost:3000/api/auth/callback?insforge_code=invalid", {
    headers: { cookie: "apply_copilot_oauth_verifier=verifier" },
  }));
  assert.equal(response.headers.get("location"), "http://localhost:3000/login?error=oauth");
  assert.equal(response.cookies.get("insforge_access_token"), undefined);
  assert.equal(response.cookies.get("apply_copilot_oauth_verifier").maxAge, 0);
});

test("refresh rejects cross-origin requests before contacting InsForge", async () => {
  const { refreshSession } = load("lib/auth-http.ts");
  const response = await refreshSession(new NextRequest("http://localhost:3000/api/auth/refresh", {
    method: "POST", headers: { origin: "https://attacker.invalid", cookie: `insforge_refresh_token=${refreshToken}` },
  }));
  assert.equal(response.status, 403);
  assert.equal(calls.length, 0);
});

test("refresh rotates cookies and never exposes the refresh token in the body", async () => {
  const { refreshSession } = load("lib/auth-http.ts");
  const response = await refreshSession(new NextRequest("http://localhost:3000/api/auth/refresh", {
    method: "POST", headers: { origin: "http://localhost:3000", cookie: `insforge_refresh_token=${refreshToken}` },
  }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.accessToken, accessToken);
  assert.equal(JSON.stringify(body).includes(refreshToken), false);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i);
});

test("proxy forwards refreshed cookies to the current server render", async () => {
  const { proxy } = load("proxy.ts");
  const response = await proxy(new NextRequest("http://localhost:3000/dashboard", {
    headers: { cookie: `insforge_access_token=${expiredToken}; insforge_refresh_token=${refreshToken}` },
  }));
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("x-middleware-request-cookie").includes(accessToken));
  assert.equal(response.cookies.get("insforge_access_token").value, accessToken);
});

test("proxy redirects anonymous nested job requests", async () => {
  const { proxy } = load("proxy.ts");
  const response = await proxy(new NextRequest("http://localhost:3000/find-jobs/123"));
  assert.equal(response.headers.get("location"), "http://localhost:3000/login");
  assert.equal(calls.length, 0);
});

test("server authorization rejects forged tokens even when their expiry is in the future", async () => {
  jar.set("insforge_access_token", accessToken);
  backend = () => Response.json({ error: "AUTH_UNAUTHORIZED", message: "Invalid token", statusCode: 401 }, { status: 401 });
  const { requireUser } = load("lib/auth.ts");
  await assert.rejects(requireUser(), (error) => error.destination === "/login?error=session");
  assert.equal(calls[0].url.pathname, "/api/auth/sessions/current");
});

test("a revoked refresh token clears stale cookies and redirects protected requests", async () => {
  backend = () => Response.json({ error: "AUTH_UNAUTHORIZED", message: "Revoked token", statusCode: 401 }, { status: 401 });
  const { proxy } = load("proxy.ts");
  const response = await proxy(new NextRequest("http://localhost:3000/dashboard", {
    headers: { cookie: `insforge_access_token=${expiredToken}; insforge_refresh_token=${refreshToken}` },
  }));
  assert.equal(response.headers.get("location"), "http://localhost:3000/login");
  assert.equal(response.cookies.get("insforge_access_token").maxAge, 0);
  assert.equal(response.cookies.get("insforge_refresh_token").maxAge, 0);
});

test("server authorization accepts a backend-validated user", async () => {
  jar.set("insforge_access_token", accessToken);
  const { requireUser } = load("lib/auth.ts");
  assert.deepEqual(await requireUser(), user);
});

test("sign-out clears both browser cookies and redirects to login", async () => {
  jar.set("insforge_access_token", accessToken);
  jar.set("insforge_refresh_token", refreshToken);
  const { signOut } = load("actions/auth.ts");
  await assert.rejects(signOut(), (error) => error.destination === "/login");
  assert.equal(jar.get("insforge_access_token").maxAge, 0);
  assert.equal(jar.get("insforge_refresh_token").maxAge, 0);
});
