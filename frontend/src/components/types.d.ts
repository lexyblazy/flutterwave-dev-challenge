interface Merchant {
  id: string;
  approved: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Session {
  token: string;
}

interface Store {
  name: string;
  description: string;
  approved: Boolean;
}

interface DispatchRider {
  name: string;
  address: string;
  phone: string;
}
