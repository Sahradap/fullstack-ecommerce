export default function ReviewCard({
  name,
  review,
}) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="review-card h-100 p-4">
        <div className="text-warning mb-3">
          ★★★★★
        </div>

        <h5 className="fw-bold">
          {name}

          <span className="text-success ms-2">
            ●
          </span>
        </h5>

        <p className="text-muted mb-0">
          “{review}”
        </p>
      </div>
    </div>
  );
}