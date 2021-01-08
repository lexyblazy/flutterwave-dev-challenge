import * as express from "express";
import * as handlers from "./handlers";

export const initialize = () => {
  const router = express.Router();

  router.post(
    "/webhook",
    handlers.authenticate,
    handlers.logRequest,
    handlers.webhook
  );

  return router;
};
