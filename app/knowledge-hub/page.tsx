"use client";

import { useMemo, useState } from "react";
import { govtSchemes, SCHEME_CATEGORIES, SchemeCategory } from "@/lib/schemesData";
import { knowledgeEntries, KnowledgeCategory } from "@/lib/knowledgeData";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Tab = "schemes" | "uses";

export default function KnowledgeHubPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("schemes");
  const [schemeCategory, setSchemeCategory] = useState<SchemeCategory | "all">("all");
  const [usesCategory, setUsesCategory] = useState<KnowledgeCategory | "all">("all");

  const filteredSchemes = useMemo(
    () => (schemeCategory === "all" ? govtSchemes : govtSchemes.filter((s) => s.category === schemeCategory)),
    [schemeCategory]
  );

  const filteredEntries = useMemo(
    () => (usesCategory === "all" ? knowledgeEntries : knowledgeEntries.filter((e) => e.category === usesCategory)),
    [usesCategory]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">{t("knowledgeHub.eyebrow")}</span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t("knowledgeHub.title")}</h1>
      <p className="mt-2 max-w-2xl text-field-600">{t("knowledgeHub.subtitle")}</p>
      <p className="mt-3 max-w-2xl text-xs text-field-400">{t("knowledgeHub.contentNote")}</p>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTab("schemes")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === "schemes" ? "bg-field-700 text-white" : "border border-field-200 text-field-700 hover:bg-field-50"
          }`}
        >
          🏛️ {t("knowledgeHub.schemesTab")}
        </button>
        <button
          type="button"
          onClick={() => setTab("uses")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            tab === "uses" ? "bg-field-700 text-white" : "border border-field-200 text-field-700 hover:bg-field-50"
          }`}
        >
          📘 {t("knowledgeHub.usesTab")}
        </button>
      </div>

      {tab === "schemes" ? (
        <section className="mt-8">
          <div className="rounded-xl border border-turmeric-200 bg-turmeric-50 p-4 text-sm text-turmeric-900">
            {t("knowledgeHub.schemesDisclaimer")}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSchemeCategory("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                schemeCategory === "all" ? "bg-field-700 text-white" : "border border-field-200 text-field-600 hover:bg-field-50"
              }`}
            >
              {t("knowledgeHub.allCategories")}
            </button>
            {SCHEME_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSchemeCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  schemeCategory === cat ? "bg-field-700 text-white" : "border border-field-200 text-field-600 hover:bg-field-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="kl-card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-field-50 text-2xl">
                    <span aria-hidden>{scheme.icon}</span>
                  </div>
                  <span className="rounded-full bg-field-100 px-2.5 py-1 text-xs font-semibold text-field-800">
                    {scheme.category}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-semibold text-field-900">{scheme.shortName}</h3>
                <p className="text-xs text-field-500">{scheme.name}</p>
                <p className="mt-2 text-sm text-field-700">{scheme.tagline}</p>

                <div className="mt-3 rounded-lg bg-field-50/70 p-3">
                  <p className="text-xs font-semibold text-field-600">{t("knowledgeHub.keyBenefit")}</p>
                  <p className="mt-0.5 text-sm font-medium text-field-900">{scheme.keyBenefit}</p>
                </div>

                <p className="mt-3 text-sm text-field-600">{scheme.description}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-field-600">{t("knowledgeHub.eligibility")}</p>
                  <ul className="mt-1.5 space-y-1">
                    {scheme.eligibility.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-field-600">
                        <span className="mt-0.5 text-field-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-field-600">{t("knowledgeHub.howToApply")}</p>
                  <p className="mt-1 text-sm text-field-600">{scheme.howToApply}</p>
                </div>

                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kl-btn-primary mt-4 justify-center"
                >
                  {t("knowledgeHub.visitOfficialSite")} ↗
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setUsesCategory("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                usesCategory === "all" ? "bg-field-700 text-white" : "border border-field-200 text-field-600 hover:bg-field-50"
              }`}
            >
              {t("knowledgeHub.allCategories")}
            </button>
            <button
              type="button"
              onClick={() => setUsesCategory("machinery")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                usesCategory === "machinery" ? "bg-field-700 text-white" : "border border-field-200 text-field-600 hover:bg-field-50"
              }`}
            >
              🚜 {t("findResources.machinery")}
            </button>
            <button
              type="button"
              onClick={() => setUsesCategory("residue")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                usesCategory === "residue" ? "bg-field-700 text-white" : "border border-field-200 text-field-600 hover:bg-field-50"
              }`}
            >
              🌾 {t("findResources.residue")}
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="kl-card flex flex-col p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-field-50 text-2xl">
                  <span aria-hidden>{entry.icon}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-field-900">{entry.name}</h3>
                <p className="mt-2 text-sm text-field-600">{entry.summary}</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-field-600">{t("knowledgeHub.bestFor")}</p>
                  <ul className="mt-1.5 space-y-1">
                    {entry.bestFor.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-field-600">
                        <span className="mt-0.5 text-field-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 rounded-lg bg-turmeric-50 p-3">
                  <p className="text-xs font-semibold text-turmeric-800">{t("knowledgeHub.tips")}</p>
                  <ul className="mt-1.5 space-y-1">
                    {entry.tips.map((item, i) => (
                      <li key={i} className="text-sm text-turmeric-900">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
