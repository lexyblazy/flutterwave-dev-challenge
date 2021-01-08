import { Component } from "react";
import "./App.css";
import { Dashboard, NavBar, Signup } from "./components";

interface AppState {
  isAuthenticated: boolean;
  user: Merchant | null;
  store: Store | null;
  dispatchRider: DispatchRider | null;
}
class App extends Component {
  state: AppState = {
    isAuthenticated: false,
    user: null,
    store: null,
    dispatchRider: null,
  };

  componentDidMount() {
    const user: Merchant = JSON.parse(localStorage.getItem("USER")!);
    const session: Session = JSON.parse(localStorage.getItem("SESSION")!);
    const store: Store = JSON.parse(localStorage.getItem("STORE")!);
    const dispatchRider: DispatchRider = JSON.parse(
      localStorage.getItem("DISPATCH_RIDER")!
    );

    if (user && session) {
      this.setState({ isAuthenticated: true, user, store, dispatchRider });
    }
  }

  updateAppState = (
    field: "store" | "dispatchRider",
    value: Store | DispatchRider
  ) => {
    this.setState({ [field]: value });
  };

  logoutAction = () => {
    localStorage.removeItem("USER");
    localStorage.removeItem("SESSION");
    localStorage.removeItem("STORE");
    localStorage.removeItem("DISPATCH_RIDER");

    this.setState({
      isAuthenticated: false,
      user: null,
      store: null,
      dispatchRider: null,
    });
  };

  render() {
    const { isAuthenticated, user, dispatchRider, store } = this.state;
    console.log(store, dispatchRider);

    return (
      <>
        <NavBar isAuthenticated={isAuthenticated} logout={this.logoutAction} />
        <div className="container">
          {isAuthenticated ? (
            <Dashboard
              merchant={user!}
              dispatchRider={dispatchRider!}
              store={store!}
              updateAppState={(
                field: "store" | "dispatchRider",
                value: Store | DispatchRider
              ) => this.updateAppState(field, value)}
            />
          ) : (
            <Signup
              setAuthentication={() => this.setState({ isAuthenticated: true })}
            />
          )}
        </div>
      </>
    );
  }
}

export default App;
