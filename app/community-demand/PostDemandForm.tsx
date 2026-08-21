"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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

export default function PostDemandForm({
  userId,
  onPosted,
  onCancel,
}: {
  userId: string;
  onPosted: () => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<ResourceCategory>("machinery");
  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const typeOptions = category === "machinery" ? MACHINERY_TYPES : RESIDUE_TYPES;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors: Record<string, string> = {};
    if (!resourceType) nextErrors.resourceType = "Select what you need.";
    if (!quantity.trim()) nextErrors.quantity = "Enter the quantity needed.";
    if (!location.trim()) nextErrors.location = "Enter a location.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("demand_posts").insert({
      user_id: userId,
      resource_type: resourceType,
      category: category === "machinery" ? "machinery" : "crop_residue",
      quantity: quantity.trim(),
      budget: budget.trim() || null,
      required_date: requiredDate || null,
      location: location.trim(),
      status: "open",
    });
    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }
    onPosted();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="kl-card space-y-4 p-5">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {(["machinery", "residue"] as ResourceCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setResourceType("");
            }}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              category === cat
                ? "border-field-600 bg-field-700 text-white"
                : "border-field-200 text-field-700 hover:bg-field-50"
            }`}
          >
            {cat === "machinery" ? "🚜 Machinery" : "🌾 Residue"}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="resourceType" className="kl-label">
          What do you need?
        </label>
        <select
          id="resourceType"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="kl-input"
        >
          <option value="">Select type</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.resourceType && <p className="mt-1 text-xs text-red-600">{errors.resourceType}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="kl-label">
            Quantity needed
          </label>
          <input
            id="quantity"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 8 acres, 100 quintals"
            className="kl-input"
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        </div>
        <div>
          <label htmlFor="budget" className="kl-label">
            Budget (optional)
          </label>
          <input
            id="budget"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. ₹2,000–2,500 / acre"
            className="kl-input"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="requiredDate" className="kl-label">
            Needed by (optional)
          </label>
          <input
            id="requiredDate"
            type="date"
            value={requiredDate}
            onChange={(e) => setRequiredDate(e.target.value)}
            className="kl-input"
          />
        </div>
        <div>
          <label htmlFor="location" className="kl-label">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Village, District, State"
            className="kl-input"
          />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="kl-btn-primary">
          {submitting ? "Posting…" : "Post Demand"}
        </button>
        <button type="button" onClick={onCancel} className="kl-btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
