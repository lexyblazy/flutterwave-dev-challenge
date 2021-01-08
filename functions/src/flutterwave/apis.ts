import * as apisauce from "apisauce";

import * as config from "../config";
import * as consts from "../consts";

const api = apisauce.create({
  baseURL: consts.FLUTTERWAVE_API_URL,
  headers: {
    authorization: `Bearer ${config.FLUTTERWAVE_SECRET_KEY}`,
  },
});

export const generatePaymentLink = ({
  transactionReference,
  amount,
  currency,
  redirectUrl,
  customer,
  merchantId,
}: {
  transactionReference: string;
  amount: string;
  currency: "USD" | "NGN";
  redirectUrl: string;
  customer: { email: string; name: string };
  merchantId: string;
}) => {
  return api.post<FlutterwaveCreatePaymentLinkResponse, FlutterwaveApiError>(
    "/v3/payments",
    {
      tx_ref: transactionReference,
      amount,
      currency,
      redirect_url: redirectUrl,
      payment_options: "card",
      meta: {
        merchantId,
      },
      customer,
      customizations: {
        title: "Jumga Financial Systems",
      },
    }
  );
};
