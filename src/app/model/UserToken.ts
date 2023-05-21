export interface UserToken {
  login: string;
  accessToken: string;
  refreshToken: string;
  accessTokenLifetimeMinutes: number;
  refreshTokenLifetimeMinutes: number;
}