import apisauce from "apisauce";
import * as consts from "./consts";

export const create = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const api = apisauce.create({
    baseURL: consts.SERVER_URL,
  });

  return api.post<MerchantSignupResponse, GeneralApiError>(
    "/merchants/signup",
    {
      firstName,
      lastName,
      email,
      password,
    }
  );
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const api = apisauce.create({
    baseURL: consts.SERVER_URL,
  });

  return api.post<MerchantLoginResponse, GeneralApiError>("/merchants/login", {
    email,
    password,
  });
};

export const logout = async () => {
  const session: Session = JSON.parse(localStorage.getItem("SESSION")!);

  const api = apisauce.create({
    baseURL: consts.SERVER_URL,
    headers: {
      authorization: session.token,
    },
  });

  return api.post("/merchants/logout", {});
};

export const approveAccount = async () => {
  const session: Session = JSON.parse(localStorage.getItem("SESSION")!);

  const api = apisauce.create({
    baseURL: consts.SERVER_URL,
    headers: {
      authorization: session.token,
    },
  });

  return api.post<{ link: string; error: null }, GeneralApiError>(
    "/merchants/approve-account",
    {}
  );
};

export const createStore = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const session: Session = JSON.parse(localStorage.getItem("SESSION")!);

  const api = apisauce.create({
    baseURL: consts.SERVER_URL,
    headers: {
      authorization: session.token,
    },
  });

  return api.post<MerchantCreateStoreResponse, GeneralApiError>(
    "/merchants/create-store",
    { name, description }
  );
};
