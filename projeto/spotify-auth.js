// spotify-auth.js (PKCE para site estático)
// Client ID (pode ficar público)
const SPOTIFY_CLIENT_ID = "3f682745e06146c89c695b2af9831b02";

// IMPORTANTE: tem que bater 100% com o Redirect URI no Spotify Dev
const REDIRECT_URI = "https://allzgoto.github.io/allz/projeto/callback";

// Escopos pra ler suas playlists
const SCOPES = [
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative"
];

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const LS = {
  verifier: "allz_spotify_pkce_verifier",
  token: "allz_spotify_token",
};

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

function randomString(len = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let out = "";
  const rnd = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) out += chars[rnd[i] % chars.length];
  return out;
}

export function spotifyLogout() {
  localStorage.removeItem(LS.verifier);
  localStorage.removeItem(LS.token);
}

export function getStoredToken() {
  const raw = localStorage.getItem(LS.token);
  if (!raw) return null;
  try {
    const t = JSON.parse(raw);
    // checa expiração
    if (Date.now() > (t.expires_at || 0)) return null;
    return t;
  } catch {
    return null;
  }
}

export async function spotifyLogin() {
  const verifier = randomString(80);
  localStorage.setItem(LS.verifier, verifier);

  const challenge = base64UrlEncode(await sha256(verifier));
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SCOPES.join(" "),
  });

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

// roda na página /callback
export async function spotifyHandleCallback() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err) throw new Error("Spotify auth error: " + err);
  if (!code) throw new Error("Sem code no callback.");

  const verifier = localStorage.getItem(LS.verifier);
  if (!verifier) throw new Error("Sem verifier (PKCE). Tente logar de novo.");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: verifier,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Token exchange falhou: " + txt);
  }

  const data = await res.json();
  const token = {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    expires_at: Date.now() + (data.expires_in * 1000) - 15000,
    scope: data.scope,
  };

  localStorage.setItem(LS.token, JSON.stringify(token));

  // limpa query e volta pro app
  window.location.href = "https://allzgoto.github.io/allz/projeto/";
}

export async function spotifyApi(path) {
  const tok = getStoredToken();
  if (!tok) throw new Error("Sem token. Faça login.");
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Spotify API erro (${res.status}): ${txt}`);
  }
  return res.json();
}
