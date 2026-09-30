import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-light pt-5">
      <div className="container">
        <div className="bg-black text-white rounded-4 p-4 p-md-5 newsletter-box">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h2 className="fw-bold mb-0">
                STAY UP TO DATE ABOUT
                <br />
                OUR LATEST OFFERS
              </h2>
            </div>

            <div className="col-md-6">
              <input
                type="email"
                className="form-control rounded-pill mb-3"
                placeholder="Enter your email address"
              />

              <button className="btn btn-light rounded-pill w-100">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        <div className="row py-5 g-4">
          <div className="col-12 col-md-4">
            <h3 className="fw-bold">SHOP.CO</h3>

            <p className="text-muted small">
              We have clothes that suit your style
              and which you are proud to wear.
            </p>

            <div className="d-flex gap-3">
              <i className="bi bi-twitter-x"></i>
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-github"></i>
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase">
              Company
            </h6>

            <p className="text-muted small">About</p>
            <p className="text-muted small">Features</p>
            <p className="text-muted small">Works</p>
            <p className="text-muted small">Career</p>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase">
              Help
            </h6>

            <p className="text-muted small">
              Customer Support
            </p>
            <p className="text-muted small">
              Delivery Details
            </p>
            <p className="text-muted small">
              Terms & Conditions
            </p>
            <p className="text-muted small">
              Privacy Policy
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase">
              FAQ
            </h6>

            <p className="text-muted small">
              Account
            </p>
            <p className="text-muted small">
              Manage Deliveries
            </p>
            <p className="text-muted small">
              Orders
            </p>
            <p className="text-muted small">
              Payments
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="text-uppercase">
              Resources
            </h6>

            <p className="text-muted small">
              Free eBooks
            </p>
            <p className="text-muted small">
              Development Tutorial
            </p>
            <p className="text-muted small">
              How to Blog
            </p>
            <p className="text-muted small">
              YouTube Playlist
            </p>
          </div>
        </div>

        <div className="border-top py-3 text-muted small">
          Shop.co © 2026. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
