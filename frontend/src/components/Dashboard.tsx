import React, { useState } from "react";
import * as apis from "../apis";

interface DashboardProps {
  merchant: Merchant;
  store: Store;
  dispatchRider: DispatchRider;
  updateAppState: (field: AppStateFields, value: AppStateValues) => void;
}

const ordersList: Order[] = [];

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

  const [storeOrders, setStoreOrders] = useState({
    orders: ordersList,
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

  const showAccountApproveAction = (merchant: Merchant, store: Store) => {
    if (!store || (store && !store.approved)) {
      return (
        <div className="text-center mb-5">
          <p>
            Hi {merchant?.firstName}, Your account is pending approval, a $20
            fee is required for approval, If you just recently made payment,
            Ignore this action while we confirm the payment
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

  const getStoreOrders = async () => {
    setStoreOrders({ orders: [], loading: true });
    setDashboardState({ ...dashboardState, errorMessage: "" });

    const response = await apis.merchants.getOrders();
    let orders: Order[] = [];

    if (response && response.ok && response.data) {
      if (response.data.orders.length > 0) {
        orders = response.data.orders;
        console.log("api success", storeOrders);
      } else {
        setDashboardState({
          ...dashboardState,
          errorMessage:
            "You have no orders yet, Please try again in 10 seconds",
        });
      }
    } else {
      setDashboardState({
        ...dashboardState,
        errorMessage: "An error occurred, try again!",
      });
    }

    setStoreOrders({ orders, loading: false });
  };

  const renderOrders = () => {
    if (storeOrders.orders.length < 1) {
      return;
    }

    const orderItems = storeOrders.orders.map((order: Order) => {
      return (
        <div key={order.id} className="col-sm-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Item name: {order.name}</h5>
              <p className="card-text">
                Price: ${order.price.toFixed(2)} <br />
                Shipping Cost: ${order.shippingCost.toFixed(2)} <br />
                Date: {new Date(order.createdAt).toString()}
              </p>
              <p className="card-text">
                <h6>Breakdown</h6>
                Seller's payout: $
                {(order.price - order.breakdown.saleCommision).toFixed(2)}{" "}
                <br />
                Jumga Sale Commision: $
                {order.breakdown.saleCommision.toFixed(2)} <br />
                Dispatch Rider payout: $
                {(
                  order.shippingCost - order.breakdown.deliveryCommission
                ).toFixed(2)}{" "}
                <br />
                Jumga Delivery Commission: $
                {order.breakdown.deliveryCommission.toFixed(2)}
                <br />
              </p>
              <p className="card-text"></p>

              {/* <a href="#" class="btn btn-primary">
              Go somewhere
            </a> */}
            </div>
          </div>
        </div>
      );
    });

    return <div className="row mt-5">{orderItems}</div>;
  };

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      {showAccountApproveAction(merchant, store)}

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

      <div className="mt-3 text-center">
        {store && store.approved && (
          <button
            className="btn btn-success"
            onClick={getStoreOrders}
            disabled={storeOrders.loading}
          >
            View all orders
          </button>
        )}
      </div>
      {renderOrders()}
    </div>
  );
};
