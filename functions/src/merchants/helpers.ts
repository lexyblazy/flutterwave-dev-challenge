import * as firebaseAdmin from "firebase-admin";
import faker from "faker";
import * as consts from "../consts";

export const createDispatchRider = async (merchantId: string) => {
  const firestore = firebaseAdmin.firestore();

  const dispatchRiderCollectionRef = firestore.collection(
    consts.DISPATCH_RIDERS_COLLECTION
  );

  await dispatchRiderCollectionRef.doc(merchantId).set({
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
  });

  const dispatchRiderSnapshot = await dispatchRiderCollectionRef
    .doc(merchantId)
    .get();

  return dispatchRiderSnapshot.data() as DispatchRiderEntity | undefined;
};
