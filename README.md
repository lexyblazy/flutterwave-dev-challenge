
The server side of the project is in `functions/` folder.

The server is hosted here: https://us-central1-flutterwave-challenge-b2f12.cloudfunctions.net/api

The server is setup with firebase so to run it locally you have to get your `serviceAccount.json` from your firebase dashboard and add it to the
`functions/src` folder,
then create a `config.ts` file in the `functions/src` folder that contains all the server environment variables.

```ts
// functions/src/config.ts

export const FLUTTERWAVE_PUBLIC_KEY = "XXXX";
export const FLUTTERWAVE_SECRET_KEY = "XXXX";
export const FLUTTERWAVE_ENCRYPTION_KEY = "XXXX";
export const FLUTTERWVE_WEBHOOK_SECRET = "XXXX";
```

To run the server

```sh
cd functions
yarn serve
```
The client side of the project is in `frontend/` folder.

To run the frontend.

```sh
cd frontend
yarn start
```
