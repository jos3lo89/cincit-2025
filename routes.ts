export const publicRoutes: string[] = [
  "/api/register/send-otp",
  "/api/register/verify-otp",
  "/api/register/create", // TODO: mejorar aparte
];

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
