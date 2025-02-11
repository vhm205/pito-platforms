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

export interface AuthenticatedPartner {
  id: string;
  name: string;
  status: string;
}

export interface AuthenticatedStore {
  id: string;
  name: string;
}
