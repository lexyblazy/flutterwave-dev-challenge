import * as functions from "firebase-functions";
import express from "express";

import * as consts from "./consts";
import { loadServicesAndRouters } from "./loadSevicesAndRouters";
import * as firestoreTriggers from "./firestoreTriggers";

const app = express();

loadServicesAndRouters(app);

export const api = functions.https.onRequest(app);

export const ProcessFlutterwaveWebhooks = functions.firestore
  .document(`${consts.FLUTTERWAVE_WEBHOOKS_COLLECTION}/{id}`)
  .onCreate(firestoreTriggers.processFlutterwaveWebhook);

export const SeedOrdersForNewStore = functions.firestore
  .document(`${consts.STORES_COLLECTION}/{id}`)
  .onCreate(firestoreTriggers.seedOrders);
