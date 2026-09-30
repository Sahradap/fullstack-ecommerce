import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../features/orders/orderSlice";
import { fetchCart, clearCart } from "../features/cart/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    items,
    cartTotal,
    loading: cartLoading,
  } = useSelector((state) => state.cart);

  const { loading: orderLoading, error } = useSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!shippingAddress.trim()) {
      return;
    }
    const result = await dispatch(
      createOrder({
        shipping_address: shippingAddress,
      }),
    );

    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());

      navigate("/order-summary");
    }
  };
  if (cartLoading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your cart is empty</h3>

        <Link to="/products" className="btn btn-dark mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm p-4">
            <h4 className="mb-4">Shipping Information</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Shipping Address</label>

                <textarea
                  className="form-control"
                  rows="5"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder="Enter your full shipping address"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Payment Method</label>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="cashOnDelivery"
                    defaultChecked
                  />

                  <label className="form-check-label" htmlFor="cashOnDelivery">
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={orderLoading}
              >
                {orderLoading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm p-4">
            <h4>Order Summary</h4>

            <hr />

            {items.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-3"
              >
                <div>
                  <strong>{item.product.name}</strong>

                  <p className="small text-muted mb-0">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <span>AED {item.item_total}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fs-5">
              <strong>Total</strong>

              <strong>AED {cartTotal}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
