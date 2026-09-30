import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText,setSearchText] = useState("");

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

   const handleSearch = (event) => {
    event.preventDefault();

    if (!searchText.trim()) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        searchText.trim()
      )}`
    );

    setSearchText("");
  };

  return (
    <>
      <div className="bg-black text-white text-center py-2 small">
        Sign up and get 20% off your first order!{" "}
        <Link to="/register" className="text-white text-decoration-underline">
          Sign Up Now
        </Link>
      </div>

      <nav className="navbar navbar-expand-lg bg-white py-3 border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            SHOP.CO
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav mx-lg-auto text-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>

            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <form
                onSubmit={handleSearch}
                className="input-group rounded-pill bg-light navbar-search"
              >
                <span className="input-group-text border-0 bg-transparent">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Search for products..."
                  value={searchText}
                  onChange={(event)=>setSearchText(event.target.value)}
                />
              </form>

              <Link to="/cart" className="text-dark fs-5 me-3">
                <i className="bi bi-cart3"></i>
              </Link>
              {isAuthenticated ? (
                <>
                  <li className="nav-item list-unstyled me-3">
                    <Link className="nav-link" to="/orders">
                      My Orders
                    </Link>
                  </li>

                  <li className="nav-item list-unstyled">
                    <button
                      type="button"
                      className="btn btn-link nav-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item list-unstyled">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
