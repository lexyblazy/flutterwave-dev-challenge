import React from "react";

interface NavBarProps {
  isAuthenticated: Boolean;
  logout: () => void;
}
export const NavBar = ({ isAuthenticated, logout }: NavBarProps) => {
  return (
    <div className="mb-5">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Jumga
          </a>
          {isAuthenticated && (
            <button className="navbar-text btn btn-link" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
