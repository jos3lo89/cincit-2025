export interface JwtRegisterPayload {
  email: string;
  purpose: string;
}

export interface JwtRegisterDecoded extends JwtRegisterPayload {
  exp: number;
  iat: number;
}
