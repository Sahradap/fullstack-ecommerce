import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, quantityInCart = 0 }) {
  function getImageUrl(imageUrl) {
    if (!imageUrl) {
      return "https://placehold.co/400x300?text=No+Image";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://127.0.0.1:8000${imageUrl}`;
  }
  const availableQuantity = product.quantity - quantityInCart;
  return (
    <>
      <div className="card h-100 shadow-sm">
        <Link to={`/products/${product.id}`}>
          <img
            src={getImageUrl(product.image_url)}
            className="card-img-top"
            alt={product.name}
            style={{
              height: "250px",
              objectFit: "contain",
            }}
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/400x300?text=Image+Not+Found";
            }}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <p className="text-muted mb-1">{product.category}</p>
          {product.brand && (
            <p className="small text-muted mb-1">Brand: {product.brand}</p>
          )}

          <h5 className="card-title">{product.name}</h5>

          <p className="card-text fw-bold">AED {product.price}</p>

          <p className="small text-muted">Available: {availableQuantity}</p>

          {/* {quantityInCart > 0 && (
          <p className="small text-success">
            In cart: {quantityInCart}
          </p>
          )} */}

          <div className="mt-auto d-flex gap-2">
            <AddToCartButton
              product={product}
              availableQuantity={availableQuantity}
              buttonClass="btn btn-outline-dark flex-fill"
            />

            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline-dark flex-fill"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
