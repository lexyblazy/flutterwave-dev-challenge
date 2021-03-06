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

type AppStateFields = "store" | "dispatchRider" | "merchant";
type AppStateValues = Store | DispatchRider | Merchant;

interface Order {
  id: string;
  name: string;
  description: string;
  price: number;
  shippingCost: number;
  storeId: string;
  createdAt: string;
  breakdown: {
    saleCommision: number;
    deliveryCommission: number;
  };
}
