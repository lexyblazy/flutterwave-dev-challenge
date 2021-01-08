import * as functions from "firebase-functions";
import express from "express";

import * as firestoreTriggers from "./firestoreTriggers";
import { loadServicesAndRouters } from "./loadSevicesAndRouters";

const app = express();

loadServicesAndRouters(app);

export const api = functions.https.onRequest(app);

export const ProcessFlutterwaveWebhooks = functions.firestore
  .document("flutterwave_webhooks/{id}")
  .onCreate(firestoreTriggers.processFlutterwaveWebhook);
