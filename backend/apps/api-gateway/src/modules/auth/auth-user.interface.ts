export interface ClientRole {
  id: string;
  name: string;
  description: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: ClientRole[];
}
