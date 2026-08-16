import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center">
      <span className="text-4xl">🌾</span>
      <h1 className="text-3xl font-semibold">This field is empty</h1>
      <p className="text-field-600">
        We couldn&apos;t find the page or listing you were looking for. It may have been removed
        or the link might be incorrect.
      </p>
      <Link href="/" className="kl-btn-primary mt-3">
        Back to Home
      </Link>
    </div>
  );
}
