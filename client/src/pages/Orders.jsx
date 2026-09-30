import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/orderSlice";
import { Link } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading orders...</p>
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
        <h1 className="mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4>No orders found</h4>

            <Link to="/products" className="btn btn-dark mt-3">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order.id} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div>
                        <h5 className="mb-1">Order #{order.id}</h5>

                        <p className="text-muted mb-0">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>

                      <span className="badge text-bg-secondary align-self-start">
                        {order.status}
                      </span>
                    </div>

                    <hr />

                    <p className="mb-2">
                      <strong>Shipping address:</strong>{" "}
                      {order.shipping_address}
                    </p>

                    <div className="mt-3">
                      <h6>Products</h6>

                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex justify-content-between border-bottom py-2"
                        >
                          <div>
                            <strong>{item.product_name}</strong>

                            <p className="small text-muted mb-0">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <span>AED {item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between mt-3 fs-5">
                      <strong>Total</strong>

                      <strong>AED {order.total_amount}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
