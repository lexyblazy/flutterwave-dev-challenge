interface MerchantSignupResponse {
  merchant: {
    id: string;
    createdAt: Date;
  };
  session: {
    id: string;
    token: string;
  };
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
