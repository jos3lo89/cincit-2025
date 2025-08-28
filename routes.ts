export const publicRoutes: string[] = [];

export const authRoutes: string[] = ["/signin"];

export const apiAuthPrefix: string = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT: string = "/";

export const protectedRoutesByRole: Record<string, string[]> = {
  ADMINISTRATOR: ["/", "/signup", "/attendance"],
  INSCRIBER: ["/", "/signup", "/attendance"],
  PARTICIPANT: [],
  STAFF: [],
};
