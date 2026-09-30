import { Link } from "react-router-dom";

export default function ProductSection({
  id,
  title,
  products,
  getImageUrl,
}) {
  return (
    <section id={id} className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        {title}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-muted">
          No products available.
        </p>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-6 col-md-4 col-lg-3"
            >
              <Link
                to={`/products/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 border-0">
                  <div className="bg-light rounded-4 p-3">
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.name}
                      className="img-fluid w-100"
                      style={{
                        height: "250px",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="card-body px-0">
                    {product.brand && (
                      <p className="text-muted small mb-1">
                        {product.brand}
                      </p>
                    )}

                    <h5 className="fw-bold product-title h-50">
                      {product.name}
                    </h5>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="text-warning">
                        ★★★★★
                      </span>

                      <small className="text-muted">
                        4.5/5
                      </small>
                    </div>

                    <p className="fw-bold fs-5 mb-0">
                      AED {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-5">
        <Link
          to="/products"
          className="btn btn-outline-dark rounded-pill px-5 py-2"
        >
          View All
        </Link>
      </div>
    </section>
  );
}