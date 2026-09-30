import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, cartTotal, loading, removingId, updatingId, error } =
    useSelector((state) => state.cart);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://placehold.co/150x150?text=No+Image";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  const handleRemove = async (cartItemId) => {
    const confirmed = window.confirm(
      "Do you want to remove this product from the cart?",
    );

    if (!confirmed) {
      return;
    }

    await dispatch(removeFromCart(cartItemId));
  };

  const handleIncrement = async (item) => {
    const maximumQuantity = item.product.quantity;

    if (item.quantity >= maximumQuantity) {
      alert(`Only ${maximumQuantity} item(s) are available.`);

      return;
    }

    await dispatch(
      updateCartQuantity({
        cartItemId: item.id,
        quantity: item.quantity + 1,
      }),
    );
  };

  const handleDecrement = async (item) => {
    const newQuantity = item.quantity - 1;

    if (newQuantity === 0) {
      await dispatch(removeFromCart(item.id));
      return;
    }

    await dispatch(
      updateCartQuantity({
        cartItemId: item.id,
        quantity: newQuantity,
      }),
    );
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <h1 className="mb-4">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <h4>Your cart is empty</h4>

            <Link to="/products" className="btn btn-dark mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              {items.map((item) => (
                <div key={item.id} className="card mb-3 shadow-sm">
                  <div className="row g-0 align-items-center">
                    <div className="col-4 col-md-3">
                      <img
                        src={getImageUrl(item.product.image_url)}
                        alt={item.product.name}
                        className="img-fluid p-3"
                        style={{
                          height: "160px",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div className="col-8 col-md-9">
                      <div className="card-body">
                        <h5>{item.product.name}</h5>

                        <p className="mb-1">AED {item.product.price}</p>

                        <div className="d-flex align-items-center gap-2 my-3">
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => handleDecrement(item)}
                            disabled={
                              updatingId === item.id || removingId === item.id
                            }
                          >
                            −
                          </button>

                          <span className="fw-bold px-2">
                            {updatingId === item.id ? "..." : item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => handleIncrement(item)}
                            disabled={
                              updatingId === item.id ||
                              removingId === item.id ||
                              item.quantity >= item.product.quantity
                            }
                          >
                            +
                          </button>
                        </div>

                        <p className="fw-bold">
                          Item total: AED {item.item_total}
                        </p>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-4">
              <div className="card shadow-sm p-4">
                <h4>Order Summary</h4>

                <hr />

                <div className="d-flex justify-content-between">
                  <span>Total</span>

                  <strong>AED {cartTotal}</strong>
                </div>

                <Link to="/checkout" className="btn btn-dark w-100 mt-4">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
