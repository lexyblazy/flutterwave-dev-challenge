import { Component } from "react";
import "./App.css";
import { Dashboard, NavBar, Signup } from "./components";

interface AppState {
  isAuthenticated: boolean;
  merchant: Merchant | null;
  store: Store | null;
  dispatchRider: DispatchRider | null;
}

class App extends Component {
  state: AppState = {
    isAuthenticated: false,
    merchant: null,
    store: null,
    dispatchRider: null,
  };

  componentDidMount() {
    const merchant: Merchant = JSON.parse(localStorage.getItem("MERCHANT")!);
    const session: Session = JSON.parse(localStorage.getItem("SESSION")!);
    const store: Store = JSON.parse(localStorage.getItem("STORE")!);
    const dispatchRider: DispatchRider = JSON.parse(
      localStorage.getItem("DISPATCH_RIDER")!
    );

    if (merchant && session) {
      this.setState({ isAuthenticated: true, merchant, store, dispatchRider });
    }
  }

  updateAppState = (field: AppStateFields, value: AppStateValues) => {
    this.setState({ [field]: value });
  };

  logoutAction = () => {
    localStorage.removeItem("MERCHANT");
    localStorage.removeItem("SESSION");
    localStorage.removeItem("STORE");
    localStorage.removeItem("DISPATCH_RIDER");

    this.setState({
      isAuthenticated: false,
      merchant: null,
      store: null,
      dispatchRider: null,
    });
  };

  render() {
    const { isAuthenticated, merchant, dispatchRider, store } = this.state;

    return (
      <>
        <NavBar isAuthenticated={isAuthenticated} logout={this.logoutAction} />
        <div className="container">
          {isAuthenticated ? (
            <Dashboard
              merchant={merchant!}
              dispatchRider={dispatchRider!}
              store={store!}
              updateAppState={(field: AppStateFields, value: AppStateValues) =>
                this.updateAppState(field, value)
              }
            />
          ) : (
            <Signup
              setAuthentication={() => this.setState({ isAuthenticated: true })}
              updateAppState={(field: AppStateFields, value: AppStateValues) =>
                this.updateAppState(field, value)
              }
            />
          )}
        </div>
      </>
    );
  }
}

export default App;
