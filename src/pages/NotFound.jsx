import { Link } from "react-router-dom";

const NotFound = ({
  title = "This page doesn't exist",
  message = "The link may be broken, or the page may have moved. Search for a medication instead.",
  linkTo = "/medications",
  linkLabel = "Browse medications",
}) => (
  <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
    <div className="max-w-[36rem]">
      <p className="tabular text-sm font-semibold text-primary">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-on-surface-variant">{message}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={linkTo}
          className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {linkLabel}
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-5 text-sm font-semibold text-on-surface hover:border-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Go to the home page
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
