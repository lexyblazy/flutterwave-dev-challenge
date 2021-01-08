declare namespace Express {
  export interface Request {
    session: SessionEntity;
    user: MerchantEntity;
  }
}

// =================================================
// DATABASE ENTITIES
// =================================================
interface MerchantEntity {
  approved: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  normalizedEmail: string;
  password: string;
}

interface SessionEntity {
  id: string;
  merchantId: string;
  token: string;
  createdAt: FirebaseFirestore.Timestamp;
}

interface StoreEntity {
  name: string;
  description: string;
  approved: Boolean;
}

interface DispatchRiderEntity {
  name: string;
  phone: string;
  adddress: string;
}
// =================================================
// External APIS
// ================================================

// FLUTTERWAVE
interface FlutterwaveCreatePaymentLinkResponse {
  status: "success";
  message: "Hosted Link";
  data: {
    link: string;
  };
}

interface FlutterwaveApiError {
  status: "error";
  message: string;
  data: any;
}

interface FlutterwaveWebhookBody {
  data: {
    account_id: number;
    amount: number;
    app_fee: number;
    auth_model: string;
    card: {};
    charged_amount: number;
    created_at: string;
    currency: string;

    customer: {
      created_at: string;
      email: string;
      id: number;
      name: string;
      phone_number: string | null;
    };

    device_fingerprint: string;
    flw_ref: string;
    id: number;
    ip: string;
    merchant_fee: number;
    narration: string;
    payment_type: string;
    processor_response: string;
    status: "successful";
    tx_ref: string;
  };
  "event.type":
    | "BANK_TRANSFER_TRANSACTION"
    | "CARD_TRANSACTION"
    | "USSD_TRANSACTION";

  event: string;
}

interface FlutterwaveWebhookEntity extends FlutterwaveWebhookBody {
  processed?: boolean;
  processedAt?: FirebaseFirestore.Timestamp;
}
