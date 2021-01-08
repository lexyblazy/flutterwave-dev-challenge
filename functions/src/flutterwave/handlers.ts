import * as express from "express";
import * as firebaseAdmin from "firebase-admin";
import * as uuid from "uuid";

import * as config from "../config";

export const webhook = async (req: express.Request, res: express.Response) => {
  res.sendStatus(200);
};

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.headers["verif-hash"] === config.FLUTTERWVE_WEBHOOK_SECRET) {
    return next();
  }
  // sending OK to here to prevent brute force attacks.
  return res.sendStatus(200);
};

export const logRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const firestore = firebaseAdmin.firestore();

  await firestore
    .collection("flutterwave_webhooks")
    .doc(uuid.v4())
    .set(req.body);

  next();
};
