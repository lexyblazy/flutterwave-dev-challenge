import * as functions from "firebase-functions";
import * as firebaseAdmin from "firebase-admin";
import * as consts from "../consts";

export const processFlutterwaveWebhook = async (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
) => {
  const webhook = snapshot.data() as FlutterwaveWebhookEntity;
  const docId = context.params.id;

  const db = firebaseAdmin.firestore();

  if (webhook.processed || webhook.processedAt) {
    return;
  }

  if (webhook.data.status !== "successful") {
    console.log(`Failed flutterwave webhook, docId = ${docId}`);

    return;
  }

  const transactionReference = webhook.data.tx_ref;

  if (!transactionReference) {
    return;
  }

  if (transactionReference.match(/APPROVAL_REQUEST/i)) {
    const [, merchantId] = transactionReference.split("-APPROVAL_REQUEST-");
    await db
      .collection("merchants")
      .doc(merchantId)
      .set({ approved: true }, { merge: true });
  }

  await db.collection(consts.FLUTTERWAVE_WEBHOOKS_COLLECTION).doc(docId).set(
    {
      processed: true,
      processedAt: firebaseAdmin.firestore.Timestamp.now(),
    },
    { merge: true }
  );
};
