The server side of the project is in `functions/` folder.

The server is deployed here: https://us-central1-flutterwave-challenge-b2f12.cloudfunctions.net/api

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

The frontend is hosted here: https://flutterwave-challenge-b2f12.firebaseapp.com

To run the frontend.

```sh
cd frontend
yarn start
```

You can use one the tests cards [here](https://developer.flutterwave.com/docs/test-cards) to make payments.

When a store is created, there's a process(`SeedOrdersForNewStore`) that seeds some dummy orders data for the store. it takes about 5 seconds

Using the values from the sample breakdown in the spec, it can be deduced that

- Delivery fee is `7.5%` of order price.
- Jumga Sale commission is `2.5%` of order price
- Jumga Delivery commision is `20%` of delivery fee
