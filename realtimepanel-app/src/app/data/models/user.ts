export interface User {
  id?: string;
  name: string;
  lastName: string;
  password: string;
  job: string;
  email: string;
  phone: string;
  imageUrl: string;
  isAdmin: boolean;
  access: string[];
}