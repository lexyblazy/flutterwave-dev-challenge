import * as express from "express";
import * as firebaseAdmin from "firebase-admin";
import * as bodyParser from "body-parser";
import cors from "cors";

import * as consts from "./consts";
import * as flutterwave from "./flutterwave";
import * as merchants from "./merchants";
import * as serviceAccount from "./serviceAccount.json";

export const loadServicesAndRouters = (app: express.Application) => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });

  app.use(cors({ origin: [consts.FRONTEND_DEV_URL, consts.FRONTEND_URL] }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(/^\/merchants/i, merchants.router.initialize());
  app.use(/^\/flutterwave/i, flutterwave.router.initialize());

  app.get("/", (_req, res) => {
    res.send("Hello from express");
  });
};
