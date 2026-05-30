const AUTH_STORAGE_KEYS = ["user", "token", "refreshToken"];
export const AUTH_SESSION_EXPIRED_EVENT = "auth-session-expired";

interface JwtPayload {
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(window.atob(paddedBase64)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null) {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
}

export function clearBrowserSession() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();

  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0]?.trim();
    if (!cookieName) return;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

export function expireAuthSession(redirectToLogin = true) {
  clearBrowserSession();
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

  if (redirectToLogin && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}
