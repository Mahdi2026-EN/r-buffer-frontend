import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Layers,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Button } from "../../components/ui/Button";
import { categoryService, contentService, productService } from "../../services/api";
import type { Announcement, Category, Product } from "../../types";
import { ProductCard } from "../../components/public/ProductCard";
import { CategoryCard } from "../../components/public/CategoryCard";
import { AnnouncementCard } from "../../components/public/AnnouncementCard";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export function HomePage() {
  const { t } = useI18n();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    productService.list().then((all) => setFeatured(all.filter((p) => p.featured).slice(0, 4))).catch(() => undefined);
    categoryService.listPublic().then(setCategories).catch(() => undefined);
    contentService.getAnnouncements().then(setAnnouncements).catch(() => undefined);
  }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    { num: "1", title: t("home.step1Title"), desc: t("home.step1Desc") },
    { num: "2", title: t("home.step2Title"), desc: t("home.step2Desc") },
    { num: "3", title: t("home.step3Title"), desc: t("home.step3Desc") },
    { num: "4", title: t("home.step4Title"), desc: t("home.step4Desc") },
  ];

  const features = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: t("home.feature1Title"), desc: t("home.feature1Desc") },
    { icon: <Layers className="h-5 w-5" />, title: t("home.feature2Title"), desc: t("home.feature2Desc") },
    { icon: <BookOpen className="h-5 w-5" />, title: t("home.feature3Title"), desc: t("home.feature3Desc") },
    { icon: <Sparkles className="h-5 w-5" />, title: t("home.feature4Title"), desc: t("home.feature4Desc") },
  ];

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-ink-50">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute -top-32 start-1/4 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
          <div className="absolute -bottom-32 end-1/4 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <Sparkles className="h-3.5 w-3.5" />
                {t("common.tagline")}
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                {t("home.heroTitle")}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
                {t("home.heroSubtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}>
                    {t("home.heroCta1")}
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" size="lg">
                    {t("home.heroCta2")}
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-xs text-ink-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Multilingual Support
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Admin Verified
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Transparent Credit
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-100 to-emerald-100 opacity-50 blur-2xl" />
              <div className="relative rounded-3xl border border-ink-200 bg-white p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white">
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-80">{t("dashboard.currentCredit")}</p>
                      <p className="mt-1 text-3xl font-bold">1,500</p>
                    </div>
                    <Wallet className="h-10 w-10 opacity-30" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-ink-100 p-4">
                      <p className="text-xs text-ink-500">{t("dashboard.addedThisMonth")}</p>
                      <p className="mt-1 text-xl font-semibold text-emerald-600">+500</p>
                    </div>
                    <div className="rounded-xl border border-ink-100 p-4">
                      <p className="text-xs text-ink-500">{t("dashboard.usedThisMonth")}</p>
                      <p className="mt-1 text-xl font-semibold text-ink-700">−120</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-ink-500">{t("dashboard.recentOrders")}</p>
                        <p className="mt-1 text-sm font-semibold text-ink-900">{t("orders.statusCompleted")} · ORD-1001</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("home.featured")}</h2>
            <p className="mt-2 text-sm text-ink-500">{t("home.featuredSub")}</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            {t("dashboard.viewAll")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("home.categories")}</h2>
            <p className="mt-2 text-sm text-ink-500">{t("home.categoriesSub")}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("home.howTitle")}</h2>
          <p className="mt-2 text-sm text-ink-500">{t("home.howSub")}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-ink-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="absolute -top-3 start-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow">
                {step.num}
              </div>
              <h3 className="mt-2 text-base font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-b from-ink-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("home.featuresTitle")}</h2>
            <p className="mt-2 text-sm text-ink-500">{t("home.featuresSub")}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-ink-200 bg-white p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {t("home.announcementsTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink-500">{t("home.announcementsSub")}</p>
          </div>
          <Link to="/announcements" className="hidden text-sm font-medium text-brand-700 hover:text-brand-800 sm:inline">
            {t("dashboard.viewAll")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.slice(0, 3).map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("home.faqTitle")}</h2>
            <p className="mt-2 text-sm text-ink-500">{t("home.faqSub")}</p>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-ink-200 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-4 text-start"
                >
                  <span className="text-sm font-semibold text-ink-900">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-ink-400 transition-transform",
                      openFaq === i && "rotate-180",
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-ink-100 px-4 py-4 text-sm text-ink-600">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center shadow-xl sm:px-12">
          <div className="absolute -bottom-24 -end-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("home.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/80">{t("home.ctaSub")}</p>
            <div className="mt-8">
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!bg-white !text-brand-700 hover:!bg-brand-50"
                  rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
                >
                  {t("home.ctaButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

