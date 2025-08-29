export const publicRoutes: string[] = [];

export const authRoutes: string[] = ["/signin"];

export const apiAuthPrefix: string = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT: string = "/";

export const protectedRoutesByRole: Record<string, string[]> = {
  ADMINISTRATOR: [
    "/",
    "/signup",
    "/attendance/call",
    "/attendance/control",
    "/inscription/all",
    "/inscription/pending",
    "/inscription/approved",
    "/inscription/rejected",
    "/report",
    "/user/change-role",
  ],
  INSCRIBER: ["/", "/signup", "/attendance/call"],
  PARTICIPANT: [],
  STAFF: [],
};
