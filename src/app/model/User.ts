export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  login: string;
  password: string;
  role: string;
  group?: number;
}