import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bookmark, Layers, Smartphone, Sparkles, Wand2 } from "lucide-react"
import LandingFlipCard from "@/components/landing/LandingFlipCard"
import LandingLanguageLinks from "@/components/landing/LandingLanguageLinks"
import LandingThemeButton from "@/components/settings/LandingThemeButton"
import Logo from "@/components/ui/Logo"
import type { Locale } from "@/lib/i18n"
import { landingContent } from "@/lib/landing"

type Props = {
  locale: Locale
  appBaseUrl?: string
}

const featureIcons = {
  bookmark: Bookmark,
  layers: Layers,
  smartphone: Smartphone,
  wand: Wand2,
}

export default function LandingHome({ locale, appBaseUrl = "https://flip-flow.dycdyp.com" }: Props) {
  const content = landingContent[locale]
  const loginHref = `${appBaseUrl}/login?locale=${locale}`

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fafc] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Logo size={36} />
          <nav className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a
              href="#how-it-works"
              className="hidden rounded-lg px-3 py-2 hover:text-blue-600 sm:inline-flex dark:hover:text-blue-400"
            >
              {content.nav.howItWorks}
            </a>
            <Link
              href="/support"
              className="rounded-lg px-3 py-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {content.nav.support}
            </Link>
            <LandingLanguageLinks locale={locale} label={content.nav.languageLabel} />
            <LandingThemeButton labels={content.theme} />
            <Link
              href={loginHref}
              className="ml-2 hidden h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-blue-700 sm:inline-flex dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
            >
              {content.nav.start}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 py-14 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_38%,#fef3c7_68%,#fce7f3_100%)] dark:bg-[linear-gradient(135deg,#09090b_0%,#172554_38%,#134e4a_70%,#3b0764_100%)]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.16) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="absolute -left-24 top-1/3 hidden h-72 w-72 rounded-full bg-blue-300/40 blur-3xl lg:block dark:bg-blue-600/20" />
        <div className="absolute -right-16 bottom-0 hidden h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl lg:block dark:bg-fuchsia-700/20" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/45 dark:text-blue-200">
              <Sparkles size={16} aria-hidden="true" />
              {content.hero.badge}
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
              {content.hero.titlePrefix}
              <br />
              {content.hero.titleMiddle}{" "}
              <span className="bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                {content.hero.titleAccent}
              </span>
            </h1>
            <p className="max-w-xl text-lg font-medium leading-8 text-zinc-700 sm:text-xl dark:text-zinc-200">
              {content.hero.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={loginHref}
                className="landing-pulse inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
              >
                {content.hero.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/80 bg-white/70 px-6 text-sm font-bold text-zinc-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100"
              >
                {content.hero.secondaryCta}
              </a>
            </div>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {content.hero.bullets.map((bullet) => (
                <li key={bullet} className="inline-flex items-center gap-1.5">
                  <span className="text-emerald-500">✓</span> {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 mx-auto my-auto h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/40 via-fuchsia-300/30 to-amber-300/30 blur-3xl dark:from-blue-700/40 dark:via-fuchsia-700/30 dark:to-amber-700/20" />
            <LandingFlipCard
              cards={content.flipCard.cards}
              hint={content.flipCard.hint}
              ariaLabel={content.flipCard.ariaLabel}
              practiceLabel={content.flipCard.practice}
              definitionLabel={content.flipCard.definition}
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {content.featuresIntro.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {content.featuresIntro.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              {content.featuresIntro.description}
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.features.map(({ icon, title, body }) => {
              const Icon = featureIcons[icon]
              return (
                <article
                  key={title}
                  className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white shadow-lg shadow-blue-500/20 transition group-hover:scale-110">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {body}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[#f7fafc] px-5 py-16 sm:py-20 dark:bg-zinc-950/40"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {content.stepsIntro.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {content.stepsIntro.title}
            </h2>
          </div>
          <div className="mt-14 space-y-20 lg:space-y-24">
            {content.steps.map((step, i) => {
              const reverse = i % 2 === 1
              return (
                <div
                  key={step.number}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <div className={`space-y-4 ${reverse ? "lg:order-2" : ""}`}>
                    <span className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-950 px-4 font-mono text-xs font-bold tracking-widest text-white dark:bg-white dark:text-zinc-950">
                      STEP {step.number}
                    </span>
                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
                      {step.body}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-200/50 via-fuchsia-200/40 to-amber-200/40 blur-2xl dark:from-blue-700/30 dark:via-fuchsia-800/20 dark:to-amber-800/10" />
                    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 p-2 shadow-2xl shadow-blue-950/20 dark:border-zinc-800">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        width={1440}
                        height={1000}
                        className={`${step.imageClassName} w-full rounded-2xl object-cover object-top`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0c0a09_0%,#1e3a8a_50%,#581c87_100%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.18) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            {content.cta.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            {content.cta.description}
          </p>
          <Link
            href={loginHref}
            className="landing-pulse mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-zinc-950 shadow-2xl shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-100"
          >
            {content.cta.button}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white px-5 py-10 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Logo size={28} />
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {content.footer.copyright}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              {content.footer.terms}
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              {content.footer.privacy}
            </Link>
            <Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400">
              {content.footer.support}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
