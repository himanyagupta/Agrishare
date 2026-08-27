"use client";

import Link from "next/link";
import ResourceCard from "@/components/ResourceCard";
import { Resource, DemandPost } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LandingContentProps {
  totalListings: number;
  villageCount: number;
  residueCount: number;
  featured: Resource[];
  demandTeaser: DemandPost[];
}

export default function LandingContent({
  totalListings,
  villageCount,
  residueCount,
  featured,
  demandTeaser,
}: LandingContentProps) {
  const { t } = useLanguage();

  const HOW_IT_WORKS = [
    { step: t("landing.step1Title"), body: t("landing.step1Body"), icon: "📝" },
    { step: t("landing.step2Title"), body: t("landing.step2Body"), icon: "🎯" },
    { step: t("landing.step3Title"), body: t("landing.step3Body"), icon: "🤝" },
  ];

  const CATEGORIES = [
    { label: "Tractors", icon: "🚜" },
    { label: "Harvesters", icon: "🌾" },
    { label: "Rotavators & Tillers", icon: "⚙️" },
    { label: "Wheat & Paddy Straw", icon: "🌱" },
    { label: "Cotton & Maize Residue", icon: "🌽" },
    { label: "Sprayers & Drills", icon: "💦" },
  ];

  const TESTIMONIALS = [
    {
      quote:
        "My tractor used to sit idle for weeks between sowing seasons. Now neighbouring farmers book it through AgriShare and I earn extra income without it ever leaving the village.",
      name: "Suresh Patel",
      place: "Bhinay, Ajmer",
    },
    {
      quote:
        "I used to burn leftover wheat straw because I had no buyer nearby. A dairy cooperative found my listing and now collects it every season.",
      name: "Radhika Devi",
      place: "Kishangarh, Ajmer",
    },
    {
      quote:
        "Finding a combine harvester before the rains used to mean calling a dozen people. Smart Match showed me the nearest available one in minutes.",
      name: "Mohan Lal Sharma",
      place: "Bhinay, Ajmer",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-field-lines">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="kl-section-eyebrow text-field-700">
              <span className="h-1.5 w-1.5 rounded-full bg-field-600" />
              {t("landing.eyebrow")}
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {t("landing.heroLine1")}
              <br className="hidden sm:block" /> {t("landing.heroLine2")}{" "}
              <span className="text-field-700">{t("landing.heroLine3")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-field-700">{t("landing.heroBody")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/find-resources" className="kl-btn-primary !px-6 !py-3 text-base">
                {t("landing.findNearYou")}
              </Link>
              <Link href="/list-resource" className="kl-btn-secondary !px-6 !py-3 text-base">
                {t("landing.listYours")}
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-field-200 pt-6">
              <div>
                <dt className="text-xs text-field-500">{t("landing.activeListings")}</dt>
                <dd className="font-display text-2xl font-semibold text-field-800">
                  {totalListings}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-field-500">{t("landing.villagesCovered")}</dt>
                <dd className="font-display text-2xl font-semibold text-field-800">
                  {villageCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-field-500">{t("landing.residueListings")}</dt>
                <dd className="font-display text-2xl font-semibold text-field-800">
                  {residueCount}
                </dd>
              </div>
            </dl>
          </div>

          {/* Signature element: a "match corridor" illustration of how Smart Match works */}
          <div className="relative">
            <div className="kl-card relative overflow-hidden p-6">
              <p className="kl-section-eyebrow text-field-500">{t("landing.howMatchLooks")}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex-1 rounded-xl bg-field-50 p-3">
                  <p className="text-xs text-field-500">Supply</p>
                  <p className="mt-1 font-display text-sm font-semibold text-field-900">
                    Combine Harvester
                  </p>
                  <p className="text-xs text-field-500">Nasirabad · Free from 24 Aug</p>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] font-mono text-field-500">18.4 km</span>
                  <svg width="52" height="16" viewBox="0 0 52 16" className="text-field-400">
                    <line x1="2" y1="8" x2="42" y2="8" strokeDasharray="4 4" stroke="currentColor" strokeWidth="2" />
                    <path d="M42 8 L36 4 M42 8 L36 12" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="flex-1 rounded-xl bg-turmeric-50 p-3">
                  <p className="text-xs text-turmeric-700">Demand</p>
                  <p className="mt-1 font-display text-sm font-semibold text-field-900">
                    8-acre Wheat Plot
                  </p>
                  <p className="text-xs text-field-500">Bhinay · Needed in 5 days</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-field-100 p-3">
                <div>
                  <p className="text-xs text-field-500">Estimated match score</p>
                  <p className="font-display text-lg font-semibold text-field-700">87 / 100</p>
                </div>
                <Link href="/smart-match" className="kl-btn-accent !px-4 !py-2 text-xs">
                  {t("landing.tryMatch")}
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-field-400">{t("landing.matchNote")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="kl-section-eyebrow text-field-700">{t("landing.howItWorksEyebrow")}</span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("landing.howItWorksTitle")}</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="kl-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-field-50 text-2xl">
                <span aria-hidden>{item.icon}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-field-900">
                {item.step}
              </h3>
              <p className="mt-2 text-sm text-field-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-field-50/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="kl-section-eyebrow text-field-700">{t("landing.categoriesEyebrow")}</span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("landing.categoriesTitle")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href="/find-resources"
                className="kl-card flex flex-col items-center gap-2 p-5 text-center hover:border-field-300"
              >
                <span className="text-3xl" aria-hidden>
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-field-800">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured resources */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kl-section-eyebrow text-field-700">{t("landing.onAgriShareNow")}</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("landing.availableNow")}</h2>
          </div>
          <Link href="/find-resources" className="kl-btn-secondary">
            {t("landing.browseAll")}
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="kl-card mt-10 flex flex-col items-center gap-2 p-12 text-center">
            <span className="text-3xl">🌱</span>
            <p className="font-display text-lg font-semibold text-field-900">
              {t("landing.noListingsYet")}
            </p>
            <p className="max-w-sm text-sm text-field-500">{t("landing.noListingsBody")}</p>
            <Link href="/signup" className="kl-btn-primary mt-3">
              {t("landing.createAccount")}
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* Community demand teaser */}
      {demandTeaser.length > 0 && (
        <section className="bg-field-900 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="kl-section-eyebrow text-turmeric-300">{t("landing.demandEyebrow")}</span>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("landing.demandTitle")}</h2>
                <p className="mt-4 text-field-200">{t("landing.demandBody")}</p>
                <Link href="/community-demand" className="kl-btn-accent mt-6 inline-flex">
                  {t("landing.viewDemand")}
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {demandTeaser.map((d) => (
                  <div key={d.id} className="rounded-2xl bg-field-800 p-5">
                    <p className="text-xs text-turmeric-300">{d.type}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{d.title}</p>
                    <p className="mt-2 text-sm text-field-300">
                      {d.quantityNeeded} · {d.location.district || d.location.village}
                    </p>
                    <p className="mt-1 text-sm text-field-300">Budget: {d.budget}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <span className="kl-section-eyebrow text-field-700">{t("landing.testimonialsEyebrow")}</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{t("landing.testimonialsTitle")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.name} className="kl-card p-6">
              <blockquote className="text-sm text-field-700">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-field-900">
                {testimonial.name}
                <span className="block text-xs font-normal text-field-500">{testimonial.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-field-400">{t("landing.testimonialsNote")}</p>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="kl-card flex flex-col items-start gap-6 bg-turmeric-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">{t("landing.ctaTitle")}</h2>
            <p className="mt-2 text-field-600">{t("landing.ctaBody")}</p>
          </div>
          <Link href="/list-resource" className="kl-btn-primary !px-6 !py-3 text-base">
            {t("nav.listResource")}
          </Link>
        </div>
      </section>
    </div>
  );
}
