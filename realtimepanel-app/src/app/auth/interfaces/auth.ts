import { User } from "../../data/models/user";

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CheckTokenResponse {
  user: User;
  token: string;
}