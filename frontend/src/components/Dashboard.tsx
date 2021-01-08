import React, { useState } from "react";
import * as apis from "../apis";

interface DashboardProps {
  merchant: Merchant;
  store: Store;
  dispatchRider: DispatchRider;
  updateAppState: (
    field: "store" | "dispatchRider",
    value: Store | DispatchRider
  ) => void;
}

export const Dashboard = ({
  merchant,
  store,
  dispatchRider,
  updateAppState,
}: DashboardProps) => {
  const [dashboardState, setDashboardState] = useState({
    errorMessage: "",
    loading: false,
  });

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    loading: false,
  });

  const { errorMessage, loading } = dashboardState;

  const approveAccountAction = async () => {
    setDashboardState({ ...dashboardState, loading: true, errorMessage: "" });

    const response = await apis.merchants.approveAccount();

    if (response && response.ok && response.data) {
      window.location.href = response.data.link;
    } else {
      const message =
        (response.data && response.data.error) ?? "An error occured";
      //   console.log(message);
      setDashboardState({
        ...dashboardState,
        errorMessage: message,
        loading: false,
      });
    }
  };

  const createStoreAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardState({ ...dashboardState, errorMessage: "" });
    setFormState({ ...formState, loading: true });

    const response = await apis.merchants.createStore({
      name: formState.name,
      description: formState.description,
    });

    if (response && response.ok && response.data) {
      const { store, dispatchRider } = response.data;

      localStorage.setItem("STORE", JSON.stringify(store));
      localStorage.setItem("DISPATCH_RIDER", JSON.stringify(dispatchRider));

      updateAppState("store", response.data.store);
      updateAppState("dispatchRider", response.data.dispatchRider);
    } else {
      const message =
        (response.data && response.data.error) ?? "An error occured";
      setDashboardState({
        ...dashboardState,
        errorMessage: message,
        loading: false,
      });
    }
    setFormState({ ...formState, loading: false });
  };

  const showAccountApproveAction = (user: Merchant, store: Store) => {
    if (!store || (store && !store.approved)) {
      return (
        <div className="text-center mb-5">
          <p>
            Hi {user?.firstName}, Your account is pending approval, a $20 fee is
            required for approval, If you just recently made payment, Ignore
            this action while we confirm the payment
          </p>
          <button
            className="btn btn-primary"
            onClick={approveAccountAction}
            disabled={loading}
          >
            Pay $20
          </button>
        </div>
      );
    }
  };

  const showStoreAndDispatcherInfo = (
    store: Store,
    dispatchRider: DispatchRider
  ) => {
    if (!store || !dispatchRider) {
      return <div />;
    }
    return (
      <div className="row g-3 mt-3">
        <div className="col card text-center">
          <h4 className="card-title">Store Details</h4>
          <p>Name: {store.name}</p>
          <p>Description: {store.description}</p>
        </div>
        <div className="col card text-center">
          <h4 className="card-title">Dispatch Rider</h4>
          <p>Name: {dispatchRider.name}</p>
          <p>Address: {dispatchRider.address}</p>
          <p>Phone: {dispatchRider.phone}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      {/* {store && !store.approved && ( */}
      {showAccountApproveAction(merchant, store)}
      {/* )} */}

      {store === null && (
        <form onSubmit={createStoreAction}>
          <div className="mb-3">
            <label htmlFor="storeName" className="form-label">
              Store Name
            </label>
            <input
              className="form-control"
              id="storeName"
              placeholder="Indaboski Electronics"
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              value={formState.name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="storeDescription" className="form-label">
              Store Description
            </label>
            <textarea
              className="form-control"
              id="storeDescription"
              rows={5}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
              value={formState.description}
            ></textarea>
          </div>
          <button
            className="btn btn-success"
            disabled={
              !formState.description || !formState.name || formState.loading
            }
          >
            Create my store
          </button>
        </form>
      )}
      {showStoreAndDispatcherInfo(store, dispatchRider)}
    </div>
  );
};
