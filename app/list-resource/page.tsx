"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ResourceCategory } from "@/lib/types";

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

interface FormValues {
  category: ResourceCategory;
  type: string;
  title: string;
  description: string;
  village: string;
  district: string;
  state: string;
  price: string;
  priceUnit: string;
  quantityOrCondition: string;
  availability: string;
  contactPhone: string;
}

const INITIAL_VALUES: FormValues = {
  category: "machinery",
  type: "",
  title: "",
  description: "",
  village: "",
  district: "",
  state: "Rajasthan",
  price: "",
  priceUnit: "per hour",
  quantityOrCondition: "",
  availability: "available",
  contactPhone: "",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function ListResourcePage() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

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
    if (!v.village.trim()) next.village = "Village is required.";
    if (!v.district.trim()) next.district = "District is required.";
    if (!v.price || Number(v.price) <= 0) next.price = "Enter a valid price greater than 0.";
    if (!v.quantityOrCondition.trim())
      next.quantityOrCondition =
        v.category === "machinery" ? "Describe the condition." : "Enter quantity available.";
    if (!/^[6-9]\d{9}$/.test(v.contactPhone.trim()))
      next.contactPhone = "Enter a valid 10-digit Indian mobile number.";
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    } else {
      const firstErrorField = document.querySelector<HTMLElement>("[data-error='true']");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="text-4xl">✅</span>
        <h1 className="mt-4 text-3xl font-semibold">Listing preview ready</h1>
        <p className="mt-3 text-field-600">
          Here&apos;s exactly what would be published. This prototype doesn&apos;t save it to a
          database yet — once Supabase is connected, submitting this form will create a real,
          searchable listing.
        </p>

        <div className="kl-card mt-8 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-field-100 px-2.5 py-1 text-xs font-semibold text-field-800">
              {values.category === "machinery" ? "Machinery" : "Crop Residue"}
            </span>
            <span className="text-xs text-field-500">{values.availability === "available" ? "Available now" : "Available soon"}</span>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold">{values.title}</h2>
          <p className="text-sm text-field-500">{values.type}</p>
          <p className="mt-2 text-sm text-field-700">{values.description}</p>
          <p className="mt-3 text-sm text-field-600">
            📍 {values.village}, {values.district}, {values.state}
          </p>
          <p className="mt-1 text-sm text-field-600">
            💰 ₹{Number(values.price).toLocaleString("en-IN")} {values.priceUnit}
          </p>
          <p className="mt-1 text-sm text-field-600">
            {values.category === "machinery" ? "🛠️ Condition" : "📦 Quantity"}:{" "}
            {values.quantityOrCondition}
          </p>
          <p className="mt-1 text-sm text-field-600">📞 {values.contactPhone}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setValues(INITIAL_VALUES);
              setSubmitted(false);
            }}
            className="kl-btn-secondary"
          >
            List Another Resource
          </button>
          <Link href="/find-resources" className="kl-btn-primary">
            Browse Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">Add a listing</span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">List a Resource</h1>
      <p className="mt-2 text-field-600">
        Share idle machinery or surplus crop residue so nearby farmers can find and use it.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
        {/* Category toggle */}
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

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="village" className="kl-label">
              Village
            </label>
            <input
              id="village"
              type="text"
              value={values.village}
              onChange={(e) => update("village", e.target.value)}
              className="kl-input"
              data-error={Boolean(errors.village)}
            />
            {errors.village && <p className="mt-1 text-xs text-red-600">{errors.village}</p>}
          </div>
          <div>
            <label htmlFor="district" className="kl-label">
              District
            </label>
            <input
              id="district"
              type="text"
              value={values.district}
              onChange={(e) => update("district", e.target.value)}
              className="kl-input"
              data-error={Boolean(errors.district)}
            />
            {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
          </div>
          <div>
            <label htmlFor="state" className="kl-label">
              State
            </label>
            <input
              id="state"
              type="text"
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              className="kl-input"
            />
          </div>
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
                  onChange={(e) => update("availability", e.target.value)}
                  className="h-4 w-4 text-field-700 focus:ring-field-400"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="contactPhone" className="kl-label">
            Contact phone number
          </label>
          <input
            id="contactPhone"
            type="tel"
            inputMode="numeric"
            value={values.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            className="kl-input"
            data-error={Boolean(errors.contactPhone)}
          />
          {errors.contactPhone && <p className="mt-1 text-xs text-red-600">{errors.contactPhone}</p>}
        </div>

        <div>
          <label htmlFor="photos" className="kl-label">
            Photos (optional)
          </label>
          <input id="photos" type="file" accept="image/*" multiple className="kl-input file:mr-4 file:rounded-full file:border-0 file:bg-field-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-field-700" />
          <p className="mt-1 text-xs text-field-500">
            Photo upload is UI-only in this prototype — files aren&apos;t stored yet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-field-100 pt-6">
          <button type="submit" className="kl-btn-primary">
            Preview Listing
          </button>
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
        </div>
      </form>
    </div>
  );
}
