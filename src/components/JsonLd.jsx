/**
 * Renders schema.org structured data. Search engines read JSON-LD anywhere
 * in the page, so it can sit inside the component that owns the data.
 * @param {{ data: object }} props
 */
const JsonLd = ({ data }) => (
  // JSON.stringify output can't break out of the script tag once "<" is escaped.
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
);

export default JsonLd;
