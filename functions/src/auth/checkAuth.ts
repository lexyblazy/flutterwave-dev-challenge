import * as express from "express";
import * as firebaseAdmin from "firebase-admin";

import * as consts from "../consts";

export const checkAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const firestore = firebaseAdmin.firestore();

  const merchantsCollectionRef = firestore.collection(
    consts.MERCHANTS_COLLECTION
  );
  const sessionsCollectionRef = firestore.collection(
    consts.SESSIONS_COLLECTION
  );

  const token = req.headers.authorization;

  const sessionsSnapshot = await sessionsCollectionRef
    .where("token", "==", token)
    .get();

  if (sessionsSnapshot.size < 1) {
    return res.status(401).send({ error: "Invalid Session!" });
  }

  const session = sessionsSnapshot.docs.map((doc) =>
    doc.data()
  )[0] as SessionEntity;

  const merchantSnapshot = await merchantsCollectionRef
    .where("id", "==", session.merchantId)
    .get();

  if (merchantSnapshot.size < 1) {
    return res.status(401).send({ error: "Invalid Merchant!" });
  }

  const merchant = merchantSnapshot.docs.map((doc) =>
    doc.data()
  )[0] as MerchantEntity;

  req.session = session;
  req.user = merchant;

  return next();
};

export const checkApprovalStatus = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user.approved) {
    return next();
  }

  return res.status(403).send({ error: "Your account is pending approval" });
};
