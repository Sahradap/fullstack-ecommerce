import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";

import {
  clearSelectedProduct,
  fetchProductById,
} from "../features/products/productSlice";
import { fetchCart } from "../features/cart/cartSlice";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    items,
    loading: cartLoading,
    error: cartError,
    message: cartMessage,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://placehold.co/600x500?text=No+Image";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://127.0.0.1:8000${imageUrl}`;
  };
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>

        <Link to="/products" className="btn btn-dark">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!selectedProduct) {
    return null;
  }

  const cartItem = items.find((item) => item.product.id === selectedProduct.id);

  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const availableQuantity = selectedProduct.quantity - quantityInCart;

  const isOutOfStock = availableQuantity <= 0;

  return (
    <main className="container py-5">
      <Link to="/products" className="btn btn-outline-dark mb-4">
        ← Back to Products
      </Link>

      <div className="row g-5">
        <div className="col-12 col-md-6">
          <div
            className="bg-light rounded p-4 d-flex justify-content-center align-items-center"
            style={{ minHeight: "450px" }}
          >
            <img
              src={getImageUrl(selectedProduct.image_url)}
              alt={selectedProduct.name}
              className="img-fluid"
              style={{
                maxHeight: "420px",
                objectFit: "contain",
              }}
              onError={(event) => {
                event.currentTarget.onerror = null;

                event.currentTarget.src =
                  "https://placehold.co/600x500?text=Image+Not+Found";
              }}
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <p className="text-uppercase text-muted mb-2">
            {selectedProduct.category}
          </p>
          {selectedProduct.brand && (
            <p className="text-muted">Brand: {selectedProduct.brand}</p>
          )}

          <h1 className="fw-bold">{selectedProduct.name}</h1>

          <h3 className="my-4">AED {selectedProduct.price}</h3>

          <p className="text-secondary">{selectedProduct.description}</p>

          <hr />

          <p>
            <strong>Available quantity:</strong> {availableQuantity}
          </p>
          {quantityInCart > 0 && (
            <p className="text-muted">In your cart: {quantityInCart}</p>
          )}

          {/* {cartMessage && (
            <div className="alert alert-success">{cartMessage}</div>
          )} */}
          {cartError && <div className="alert alert-danger">{cartError}</div>}

          <div className="d-flex gap-3 mt-4">
            <AddToCartButton
              product={selectedProduct}
              availableQuantity={availableQuantity}
              buttonClass="btn btn-dark btn-lg"
            />

            <Link to="/cart" className="btn btn-outline-dark btn-lg">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
