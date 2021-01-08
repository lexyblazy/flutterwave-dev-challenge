import * as express from "express";

import * as auth from "../auth";
import * as handlers from "./handlers";

export const initialize = () => {
  const router = express.Router();

  router.post("/signup", handlers.signup);

  router.post("/login", handlers.login)

  router.post(
    "/approve-account",
    auth.checkAuth,
    handlers.requestAccountApproval
  );

  router.post(
    "/create-store",
    auth.checkAuth,
    auth.checkApprovalStatus,
    handlers.createStore
  );

  return router;
};
