const RETURN_TO_KEY = "balaji_nivesh_auth_return_to";

export function safeReturnTo(value: string | null | undefined, fallback = "/partner/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/auth")) return fallback;
  return value;
}

export function rememberReturnTo(path: string) {
  sessionStorage.setItem(RETURN_TO_KEY, safeReturnTo(path));
}

export function consumeReturnTo(fallback = "/partner/dashboard") {
  const destination = safeReturnTo(sessionStorage.getItem(RETURN_TO_KEY), fallback);
  sessionStorage.removeItem(RETURN_TO_KEY);
  return destination;
}

export function distributorLoginPath(returnTo = "/partner/dashboard") {
  return `/auth?mode=distributor&returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}