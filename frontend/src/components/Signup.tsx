import React, { useState } from "react";

import * as apis from "../apis";
import * as utils from "../utils";

export const Signup = ({
  setAuthentication,
  updateAppState,
}: {
  setAuthentication: () => void;
  updateAppState: (field: AppStateFields, values: AppStateValues) => void;
}) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formType, setFormType] = useState("signup");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    console.log(formType);
    let message = "";

    if (formType === "signup") {
      const response = await apis.merchants.create({
        email: state.email,
        password: state.password,
        firstName: state.firstName,
        lastName: state.lastName,
      });

      if (response && response.ok && response.data) {
        localStorage.setItem(
          "MERCHANT",
          JSON.stringify(response.data.merchant)
        );
        localStorage.setItem("SESSION", JSON.stringify(response.data.session));

        setTimeout(setAuthentication, 1000);

        return;
      }
      message = response.data?.error ?? "Failed to create merchant";
    } else {
      const response = await apis.merchants.login({
        email: state.email,
        password: state.password,
      });

      if (response && response.ok && response.data) {
        const { merchant, session, store, dispatchRider } = response.data;
        localStorage.setItem("MERCHANT", JSON.stringify(merchant));
        localStorage.setItem("SESSION", JSON.stringify(session));
        localStorage.setItem("STORE", JSON.stringify(store));
        localStorage.setItem("DISPATCH_RIDER", JSON.stringify(dispatchRider));

        updateAppState("dispatchRider", dispatchRider);
        updateAppState("merchant", merchant);
        updateAppState("store", store);

        setTimeout(setAuthentication, 1000);

        return;
      }
      message = response.data?.error ?? "Failed to Login";
    }

    setErrorMessage(message);
    setLoading(false);
  };

  const emailAndPasswordDisabled =
    !state.email || !utils.isValidEmail(state.email) || !state.password;

  const firstNameAndLastNameDisabled = !state.firstName || !state.lastName;

  const loginDisabled = emailAndPasswordDisabled || loading;

  const signupDisabled =
    emailAndPasswordDisabled || firstNameAndLastNameDisabled || loading;

  const disabled = formType === "signup" ? signupDisabled : loginDisabled;

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

      {formType === "signup" && (
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              aria-label="First name"
              onChange={(e) =>
                setState({ ...state, firstName: e.target.value })
              }
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
      )}

      <button
        type="submit"
        className="btn btn-primary mb-2"
        disabled={disabled}
      >
        {formType[0].toUpperCase() + formType.slice(1)}
      </button>
      <div>
        {formType === "signup" ? (
          <small className="btn-link" onClick={() => setFormType("login")}>
            Already have an account? Login!
          </small>
        ) : (
          <small className="btn-link" onClick={() => setFormType("signup")}>
            New merchant? Signup!
          </small>
        )}
      </div>
    </form>
  );
};
