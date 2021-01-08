import * as express from "express";
import * as firebaseAdmin from "firebase-admin";
import * as uuid from "uuid";
import * as bcrypt from "bcrypt";

import * as consts from "../consts";
import * as utils from "../utils";
import * as flutterwave from "../flutterwave";

import * as helpers from "./helpers";

export const signup = async (req: express.Request, res: express.Response) => {
  const firestore = firebaseAdmin.firestore();
  const merchantsCollectionRef = firestore.collection(
    consts.MERCHANTS_COLLECTION
  );
  const sessionsCollectionRef = firestore.collection(
    consts.SESSIONS_COLLECTION
  );

  const { firstName, lastName, email, password } = req.body;
  const normalizedEmail = utils.normalizeEmail(email);

  const existingMerchantSnapshot = await merchantsCollectionRef
    .where("normalizedEmail", "==", normalizedEmail)
    .get();

  if (existingMerchantSnapshot.size > 0) {
    return res.status(400).send({ error: "Email in use by another user" });
  }

  const hashedPassword = bcrypt.hashSync(password, consts.SALT_ROUNDS);
  const merchantId = uuid.v4();
  const sessionId = uuid.v4();

  const newMerchant: MerchantEntity = {
    id: merchantId,
    firstName,
    lastName,
    email,
    normalizedEmail,
    password: hashedPassword,
    createdAt: firebaseAdmin.firestore.Timestamp.now(),
    approved: false,
  };

  const newSession: SessionEntity = {
    id: sessionId,
    merchantId,
    token: uuid.v4(),
    createdAt: firebaseAdmin.firestore.Timestamp.now(),
  };

  await merchantsCollectionRef.doc(merchantId).set(newMerchant);
  await sessionsCollectionRef.doc(sessionId).set(newSession);

  const [merchantDocSnapshot, sessionDocSnapshot] = await Promise.all([
    merchantsCollectionRef.doc(merchantId).get(),
    sessionsCollectionRef.doc(sessionId).get(),
  ]);
  const merchant = merchantDocSnapshot.data() as MerchantEntity | undefined;
  const session = sessionDocSnapshot.data() as SessionEntity | undefined;

  if (!merchant || !session) {
    return res.status(500).send({ error: "Something went wrong, Try again!" });
  }

  return res.status(200).send({
    merchant: {
      id: merchant.id,
      approved: merchant.approved,
      createdAt: merchant.createdAt.toDate(),
      email: merchant.email,
      firstName: merchant.firstName,
      lastName: merchant.lastName,
    },
    session: {
      token: session.token,
    },
  });
};

export const login = async (req: express.Request, res: express.Response) => {
  const firestore = firebaseAdmin.firestore();
  const merchantsCollectionRef = firestore.collection(
    consts.MERCHANTS_COLLECTION
  );
  const sessionsCollectionRef = firestore.collection(
    consts.SESSIONS_COLLECTION
  );

  const storesCollectionRef = firestore.collection(consts.STORES_COLLECTION);
  const dispatchRidersCollectionRef = firestore.collection(
    consts.DISPATCH_RIDERS_COLLECTION
  );

  const { email, password } = req.body;
  const normalizedEmail = utils.normalizeEmail(email);

  const merchantSnapshot = await merchantsCollectionRef
    .where("normalizedEmail", "==", normalizedEmail)
    .get();

  if (merchantSnapshot.size < 1) {
    return res.status(401).send({ error: "Incorrect email or password" });
  }
  const merchant = merchantSnapshot.docs.map((doc) =>
    doc.data()
  )[0] as MerchantEntity;

  const isCorrectPassword = bcrypt.compareSync(password, merchant.password);

  if (!isCorrectPassword) {
    return res.status(401).send({ error: "Incorrect email or password" });
  }

  // create new session

  const sessionId = uuid.v4();

  const newSession: SessionEntity = {
    id: sessionId,
    merchantId: merchant.id,
    token: uuid.v4(),
    createdAt: firebaseAdmin.firestore.Timestamp.now(),
  };

  await sessionsCollectionRef.doc(sessionId).set(newSession);

  // get session, store and dispatchRider
  const [
    storeDocSnapshot,
    dispatchDocRiderSnapshot,
    sessionDocSnapshot,
  ] = await Promise.all([
    storesCollectionRef.doc(merchant.id).get(),
    dispatchRidersCollectionRef.doc(merchant.id).get(),
    sessionsCollectionRef.doc(sessionId).get(),
  ]);

  const store = storeDocSnapshot.data() as StoreEntity;
  const dispatchRider = dispatchDocRiderSnapshot.data() as DispatchRiderEntity;
  const session = sessionDocSnapshot.data() as SessionEntity | undefined;

  return res.send({
    merchant: {
      id: merchant.id,
      approved: merchant.approved,
      createdAt: merchant.createdAt.toDate(),
      email: merchant.email,
      firstName: merchant.firstName,
      lastName: merchant.lastName,
    },
    session: {
      token: session?.token,
    },
    store: store ?? null,
    dispatchRider: dispatchRider ?? null,
  });
};

export const requestAccountApproval = async (
  req: express.Request,
  res: express.Response
) => {
  const { id, email, firstName, lastName } = req.user;

  if (req.user.approved) {
    return res
      .status(403)
      .send({ error: "Your account has already been approved" });
  }

  const transactionReference = `${uuid.v4()}-APPROVAL_REQUEST-${id}`;

  const response = await flutterwave.apis.generatePaymentLink({
    transactionReference,
    amount: "20",
    customer: {
      email: email,
      name: `${firstName} ${lastName}`,
    },
    currency: "USD",
    merchantId: id,
    redirectUrl: consts.FRONTEND_DEV_URL,
  });

  if (!response || !response.ok || !response.data) {
    console.log({
      problem: response.problem,
      status: response.status,
      data: response.data,
    });
    return res
      .status(response?.status || 500)
      .send({ error: response.data?.message });
  }

  return res.send(response.data.data);
};

export const createStore = async (
  req: express.Request,
  res: express.Response
) => {
  /* 
    General assumption is: 
    One Merchant -> One store -> One dispatch rider,
    so merchantId = storeId = dispatchRiderId, across all collections
  */
  const { name, description } = req.body;

  const merchantId = req.user.id;

  const firestore = firebaseAdmin.firestore();
  const storesCollectionRef = firestore.collection(consts.STORES_COLLECTION);

  await storesCollectionRef.doc(merchantId).set({
    name,
    description,
    approved: true, // since merchant is already approved
  });

  const dispatchRider = await helpers.createDispatchRider(merchantId);

  const storeSnapshot = await storesCollectionRef.doc(merchantId).get();

  const store = storeSnapshot.data() as StoreEntity | undefined;

  res.send({ store: store ?? null, dispatchRider: dispatchRider ?? null });
};
