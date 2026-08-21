"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ResourceCategory } from "@/lib/types";
import { Database } from "@/lib/supabase/types";

const MACHINERY_TYPES = [
  "Tractor",
  "Rotavator",
  "Combine Harvester",
  "Seed Drill",
  "Power Tiller",
  "Sprayer",
  "Thresher",
  "Laser Land Leveller",
  "Baler",
];

const RESIDUE_TYPES = [
  "Wheat Straw (Bhusa)",
  "Paddy Straw",
  "Sugarcane Trash",
  "Cotton Stalks",
  "Maize Stover",
  "Mustard Husk",
  "Groundnut Shells",
];

const MACHINERY_UNITS = ["per hour", "per day", "per acre"];
const RESIDUE_UNITS = ["per quintal", "per tonne"];

type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];

interface FormValues {
  category: ResourceCategory;
  type: string;
  title: string;
  description: string;
  location: string;
  price: string;
  priceUnit: string;
  quantityOrCondition: string;
  availability: "available" | "upcoming" | "booked";
}

function rowToValues(row: ResourceRow): FormValues {
  return {
    category: row.category === "machinery" ? "machinery" : "residue",
    type: row.type,
    title: row.name,
    description: row.description ?? "",
    location: row.location,
    price: String(row.price),
    priceUnit: row.price_unit,
    quantityOrCondition: row.quantity ?? "",
    availability: row.status,
  };
}

const INITIAL_VALUES: FormValues = {
  category: "machinery",
  type: "",
  title: "",
  description: "",
  location: "",
  price: "",
  priceUnit: "per hour",
  quantityOrCondition: "",
  availability: "available",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function ResourceForm({
  mode,
  ownerId,
  existing,
}: {
  mode: "create" | "edit";
  ownerId: string;
  existing?: ResourceRow;
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(existing ? rowToValues(existing) : INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const typeOptions = values.category === "machinery" ? MACHINERY_TYPES : RESIDUE_TYPES;
  const unitOptions = values.category === "machinery" ? MACHINERY_UNITS : RESIDUE_UNITS;

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(v: FormValues): FormErrors {
    const next: FormErrors = {};
    if (!v.type) next.type = "Select a resource type.";
    if (v.title.trim().length < 5) next.title = "Title should be at least 5 characters.";
    if (v.description.trim().length < 20) next.description = "Add a bit more detail (20+ characters).";
    if (!v.location.trim()) next.location = "Enter a location, e.g. Village, District, State.";
    if (!v.price || Number(v.price) <= 0) next.price = "Enter a valid price greater than 0.";
    if (!v.quantityOrCondition.trim())
      next.quantityOrCondition =
        v.category === "machinery" ? "Describe the condition." : "Enter quantity available.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>("[data-error='true']");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const payload = {
      owner_id: ownerId,
      type: values.type,
      category: (values.category === "machinery" ? "machinery" : "crop_residue") as "machinery" | "crop_residue",
      name: values.title.trim(),
      description: values.description.trim(),
      quantity: values.quantityOrCondition.trim(),
      unit: values.category === "machinery" ? null : "quintal",
      price: Number(values.price),
      price_unit: values.priceUnit,
      location: values.location.trim(),
      status: values.availability,
    };

    if (mode === "create") {
      const { data, error } = await supabase.from("resources").insert(payload).select().single();
      setSubmitting(false);
      if (error) {
        setSubmitError(error.message);
        return;
      }
      setSavedId(data.id);
    } else if (existing) {
      const { data, error } = await supabase
        .from("resources")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      setSubmitting(false);
      if (error) {
        setSubmitError(error.message);
        return;
      }
      setSavedId(data.id);
    }
  }

  if (savedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="text-4xl">✅</span>
        <h1 className="mt-4 text-3xl font-semibold">
          {mode === "create" ? "Listing published" : "Listing updated"}
        </h1>
        <p className="mt-3 text-field-600">
          {mode === "create"
            ? "Your resource is now live and searchable on AgriShare."
            : "Your changes have been saved."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/resource/${savedId}`} className="kl-btn-primary">
            View Listing
          </Link>
          <Link href="/dashboard" className="kl-btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">
        {mode === "create" ? "Add a listing" : "Edit listing"}
      </span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
        {mode === "create" ? "List a Resource" : "Edit Resource"}
      </h1>
      <p className="mt-2 text-field-600">
        Share idle machinery or surplus crop residue so nearby farmers can find and use it.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <fieldset>
          <legend className="kl-label">What are you listing?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["machinery", "residue"] as ResourceCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => update("category", cat)}
                className={`kl-card flex items-center gap-3 p-4 text-left transition-colors ${
                  values.category === cat ? "border-field-600 bg-field-50" : ""
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {cat === "machinery" ? "🚜" : "🌾"}
                </span>
                <div>
                  <p className="font-semibold text-field-900">
                    {cat === "machinery" ? "Machinery" : "Crop Residue"}
                  </p>
                  <p className="text-xs text-field-500">
                    {cat === "machinery" ? "Tractors, harvesters, tools..." : "Straw, stalks, husk..."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="type" className="kl-label">
            Resource type
          </label>
          <select
            id="type"
            value={values.type}
            onChange={(e) => update("type", e.target.value)}
            className="kl-input"
            data-error={Boolean(errors.type)}
          >
            <option value="">Select type</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="title" className="kl-label">
            Listing title
          </label>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Mahindra 47 HP Tractor with Trolley"
            className="kl-input"
            data-error={Boolean(errors.title)}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="kl-label">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe the resource, its use, and any conditions for hiring or collection."
            className="kl-input"
            data-error={Boolean(errors.description)}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="location" className="kl-label">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Village, District, State"
            className="kl-input"
            data-error={Boolean(errors.location)}
          />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="kl-label">
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="e.g. 650"
              className="kl-input"
              data-error={Boolean(errors.price)}
            />
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="priceUnit" className="kl-label">
              Price unit
            </label>
            <select
              id="priceUnit"
              value={values.priceUnit}
              onChange={(e) => update("priceUnit", e.target.value)}
              className="kl-input"
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="quantityOrCondition" className="kl-label">
            {values.category === "machinery" ? "Condition" : "Quantity available"}
          </label>
          <input
            id="quantityOrCondition"
            type="text"
            value={values.quantityOrCondition}
            onChange={(e) => update("quantityOrCondition", e.target.value)}
            placeholder={
              values.category === "machinery" ? "e.g. 2019 model, well maintained" : "e.g. 60 quintals"
            }
            className="kl-input"
            data-error={Boolean(errors.quantityOrCondition)}
          />
          {errors.quantityOrCondition && (
            <p className="mt-1 text-xs text-red-600">{errors.quantityOrCondition}</p>
          )}
        </div>

        <fieldset>
          <legend className="kl-label">Availability</legend>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "available", label: "Available now" },
              { value: "upcoming", label: "Available soon" },
              { value: "booked", label: "Currently booked" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`kl-card flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm ${
                  values.availability === opt.value ? "border-field-600 bg-field-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  value={opt.value}
                  checked={values.availability === opt.value}
                  onChange={(e) => update("availability", e.target.value as "available" | "upcoming" | "booked")}
                  className="h-4 w-4 text-field-700 focus:ring-field-400"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="photos" className="kl-label">
            Photos (optional)
          </label>
          <input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            className="kl-input file:mr-4 file:rounded-full file:border-0 file:bg-field-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-field-700"
          />
          <p className="mt-1 text-xs text-field-500">
            Photo upload isn&apos;t wired up yet — this field is UI-only for now.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-field-100 pt-6">
          <button type="submit" disabled={submitting} className="kl-btn-primary">
            {submitting ? "Saving…" : mode === "create" ? "Publish Listing" : "Save Changes"}
          </button>
          {mode === "create" && (
            <button
              type="button"
              onClick={() => {
                setValues(INITIAL_VALUES);
                setErrors({});
              }}
              className="kl-btn-secondary"
            >
              Clear form
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
