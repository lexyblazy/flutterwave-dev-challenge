export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/flutterwave-challenge-b2f12/us-central1/api"
    : "https://us-central1-flutterwave-challenge-b2f12.cloudfunctions.net/api";
