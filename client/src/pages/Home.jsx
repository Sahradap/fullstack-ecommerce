import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import bannerImage from "../assets/banner.png";
import dressStyle from "../assets/style.png";
import ProductSection from "../components/ProductSection";
import ReviewCard from "../components/ReviewCard";

export default function Home() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const newArrivals = products.slice(0, 4);
  const topSelling = products.slice(4, 8);

  function getImageUrl(imageUrl) {
    if (!imageUrl) {
      return "https://placehold.co/400x300?text=No+Image";
    }

    const backendUrl =
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

    const url = new URL(imageUrl, `${backendUrl}/`);

    // Serve the bundled sample images from the frontend.
    if (url.pathname.startsWith("/media/product_images/")) {
      return url.pathname;
    }

    // Handle a stored path without the /media/ prefix.
    if (url.pathname.startsWith("/product_images/")) {
      return `/media${url.pathname}`;
    }

    return url.href;
  }

  return (
    <>
      <section className="banner">
        <div className="container px-0">
          <div className="row align-items-center min-vh-75">
            <div className="col-12 col-lg-6 py-5 ps-lg-5">
              <h1 className="banner-title fw-bold">
                FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
              </h1>
              <p className="text-muted my-4">
                Browse through our diverse range of carefully crafted garments,
                designed to bring out your individuality and cater to your sense
                of style.
              </p>
              <Link
                to="/products"
                className="btn btn-dark rounded-pill px-5 py-3"
              >
                Shop Now
              </Link>

              <div className="row mt-5 g-3">
                <div className="col-4">
                  <h3 className="fw-bold mb-0">200+</h3>
                  <small className="text-muted">International Brands</small>
                </div>
                <div className="col-4 border-start">
                  <h3 className="fw-bold mb-0">2,000+</h3>
                  <small className="text-muted">High-Quality Products</small>
                </div>
                <div className="col-4 border-start">
                  <h3 className="fw-bold mb-0">30,000+</h3>
                  <small className="text-muted">Happy Customers</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 align-self-stretch d-flex align-items-end">
              <img
                src={bannerImage}
                alt="Models"
                className="d-block w-100"
                style={{
                  transform: "scale(1.25)",
                  transformOrigin: "bottom center",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black py-4">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center text-white g-4">
            <div className="col-6 col-md">
              <Link
                to="/products?brand=Versace"
                className="text-white text-decoration-none"
              >
                <h3 className="brand-name mb-0">VERSACE</h3>
              </Link>
            </div>

            <div className="col-6 col-md">
              <Link
                to="/products?brand=Zara"
                className="text-white text-decoration-none"
              >
                <h3 className="brand-name mb-0">ZARA</h3>
              </Link>
            </div>

            <div className="col-6 col-md">
              <Link
                to="/products?brand=Gucci"
                className="text-white text-decoration-none"
              >
                <h3 className="brand-name mb-0">GUCCI</h3>
              </Link>
            </div>

            <div className="col-6 col-md">
              <Link
                to="/products?brand=Prada"
                className="text-white text-decoration-none"
              >
                <h3 className="brand-name mb-0">PRADA</h3>
              </Link>
            </div>

            <div className="col-12 col-md">
              <Link
                to="/products?brand=Calvin Klein"
                className="text-white text-decoration-none"
              >
                <h3 className="brand-name mb-0">CALVIN KLEIN</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products loading/error */}
      {loading && (
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="mt-3">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="container py-5">
          <div className="alert alert-danger">
            {typeof error === "string" ? error : "Failed to load products"}
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* New Arrivals */}
          <ProductSection
            id="new-arrivals"
            title="NEW ARRIVALS"
            products={newArrivals}
            getImageUrl={getImageUrl}
          />

          <div className="container">
            <hr className="my-0" />
          </div>

          {/* Top Selling */}
          <ProductSection
            title="TOP SELLING"
            products={topSelling}
            getImageUrl={getImageUrl}
          />
        </>
      )}

      {/* Browse by dress style */}
      <section className="container pb-5">
        <Link to="/products">
          <img
            src={dressStyle}
            alt="Browse by dress style"
            className="img-fluid w-100 rounded-5"
          />
        </Link>
      </section>

      {/* Customer reviews */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title fw-bold mb-0">OUR HAPPY CUSTOMERS</h2>

          <div className="d-flex gap-3">
            <button type="button" className="btn border-0 fs-4">
              ←
            </button>

            <button type="button" className="btn border-0 fs-4">
              →
            </button>
          </div>
        </div>

        <div className="row g-4">
          <ReviewCard
            name="Sarah M."
            review="I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
          />

          <ReviewCard
            name="Alex K."
            review="Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options is truly remarkable."
          />

          <ReviewCard
            name="James L."
            review="As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is excellent."
          />
        </div>
      </section>
    </>
  );
}
