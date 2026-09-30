import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OrderSummary() {
  const { currentOrder } = useSelector((state) => state.orders);

  if (!currentOrder) {
    return (
      <div className="container py-5 text-center">
        <h3>No order information found</h3>

        <Link to="/products" className="btn btn-dark mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <div className="display-4 text-success">✓</div>

        <h1>Order Placed Successfully</h1>

        <p className="text-muted">Thank you for your purchase.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between">
              <span>Order ID</span>

              <strong>#{currentOrder.id}</strong>
            </div>

            <hr />

            <p>
              <strong>Shipping address:</strong>
            </p>

            <p>{currentOrder.shipping_address}</p>

            <p>
              <strong>Status:</strong> {currentOrder.status}
            </p>

            <hr />

            <h5 className="mb-3">Ordered Products</h5>

            {currentOrder.items.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-3"
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

            <hr />

            <div className="d-flex justify-content-between fs-5">
              <strong>Total</strong>

              <strong>AED {currentOrder.total_amount}</strong>
            </div>

            <div className="d-flex gap-3 mt-4">
              <Link to="/products" className="btn btn-dark">
                Continue Shopping
              </Link>

              <Link to="/orders" className="btn btn-outline-dark">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
