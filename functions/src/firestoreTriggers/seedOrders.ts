import * as functions from "firebase-functions";
import faker from "faker";
import * as firebaseAdmin from "firebase-admin";
import * as consts from "../consts";

export const seedOrders = async (
  _snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
) => {
  const db = firebaseAdmin.firestore();

  const storeId = context.params.id;

  const orders = Array(10)
    .fill("")
    .map(() => {
      const price = Math.ceil(2000 + Math.random() * 50000);
      const saleCommision = price * consts.SALE_COMMISION_PERCENT;

      const deliveryFee = price * consts.DELIVERY_FEE_PERCENT;
      const deliveryCommission =
        deliveryFee * consts.DELIVERY_COMMISION_PERCENT;

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price,
        shippingCost: deliveryFee,
        createdAt: firebaseAdmin.firestore.Timestamp.now(),
        storeId,
        breakdown: {
          saleCommision,
          deliveryCommission,
        },
      };
    });

  for (const order of orders) {
    db.collection(consts.ORDERS_COLLECTIONS).doc().set(order);
  }
};
