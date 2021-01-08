import React, { useState } from "react";

import * as apis from "../apis";
import * as utils from "../utils";

export const Signup = ({
  setAuthentication,
}: {
  setAuthentication: () => void;
}) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const response = await apis.merchants.create({
      email: state.email,
      password: state.password,
      firstName: state.firstName,
      lastName: state.lastName,
    });

    if (response && response.ok && response.data) {
      localStorage.setItem("USER", JSON.stringify(response.data.merchant));
      localStorage.setItem("SESSION", JSON.stringify(response.data.session));

      setTimeout(setAuthentication, 1000);

      return;
    }

    const message = response.data?.error ?? "Failed to create user";

    setErrorMessage(message);
    setLoading(false);
  };

  const disabled =
    !state.email ||
    !utils.isValidEmail(state.email) ||
    !state.password ||
    !state.email ||
    !state.password ||
    !state.firstName ||
    !state.lastName ||
    loading;
  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
        />
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            aria-label="First name"
            onChange={(e) => setState({ ...state, firstName: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            aria-label="Last name"
            onChange={(e) => setState({ ...state, lastName: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={disabled}>
        Signup
      </button>
    </form>
  );
};
