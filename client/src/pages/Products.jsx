import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/products/productSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { Link, useSearchParams } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const { items } = useSelector((state) => state.cart);

  const [searchParams] = useSearchParams();
  const selectedBrand = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    dispatch(fetchProducts());
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {typeof error === "string" ? error : "Failed to load products"}
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchesBrand = selectedBrand
      ? product.brand?.toLowerCase() === selectedBrand.toLowerCase()
      : true;

    const matchesSearch = searchQuery
      ? product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesBrand && matchesSearch;
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : selectedBrand
              ? `${selectedBrand} Products`
              : "Products"}
        </h1>

        {(searchQuery || selectedBrand) && (
          <Link to="/products" className="btn btn-outline-dark rounded-pill">
            View All Products
          </Link>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => {
            const cartItem = items.find(
              (item) => item.product.id === product.id,
            );

            const quantityInCart = cartItem ? cartItem.quantity : 0;

            return (
              <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                <ProductCard
                  product={product}
                  quantityInCart={quantityInCart}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
