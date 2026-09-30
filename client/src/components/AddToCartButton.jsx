import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addToCart,
  fetchCart,
  clearCartMessage,
} from "../features/cart/cartSlice";

export default function AddToCartButton({
  product,
  availableQuantity,
  buttonClass = "btn btn-dark",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const isOutOfStock = availableQuantity <= 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdding(true);

    const result = await dispatch(
      addToCart({
        product_id: product.id,
        quantity: 1,
      }),
    );

    if (addToCart.fulfilled.match(result)) {
      dispatch(fetchCart());

      setTimeout(() => {
        dispatch(clearCartMessage());
      }, 2000);
    }

    setIsAdding(false);
  };

  return (
    <button
      type="button"
      className={buttonClass}
      disabled={isOutOfStock || isAdding}
      onClick={handleAddToCart}
    >
      {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
