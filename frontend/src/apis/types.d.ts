interface MerchantSignupResponse {
  merchant: Merchant;
  session: Session;
  error: null;
}

interface MerchantLoginResponse {
  merchant: Merchant;
  session: Session;
  store: Store;
  dispatchRider: DispatchRider;
  error: null;
}
interface GeneralApiError {
  error: string;
}

interface MerchantCreateStoreResponse {
  store: Store;
  dispatchRider: DispatchRider;
  error: null;
}

interface MerchantOrdersReponse {
  orders: Order[];
}
