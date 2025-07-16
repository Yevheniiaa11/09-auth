export type User = {
  id: string;
  email: string;
  userName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
};

export interface AuthSuccessData {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginResult {
  ok: boolean;
  data?: AuthSuccessData;
  error?: string;
}
