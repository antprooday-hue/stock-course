/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  AwardIcon,
  BrainIcon,
  StarIcon,
  TrendingUpIcon,
} from "../components/icons";
import { ScrollReveal } from "../components/scroll-reveal";
import { SiteFooter } from "../components/site-footer";

export function LandingScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,#f1fff5_0%,#faf9f6_42%,#eef7f1_100%)]">
      <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[linear-gradient(135deg,#f0fff4_0%,#e9fdf1_100%)] px-4 py-2 shadow-[0_10px_26px_rgba(22,163,74,0.10)]">
              <StarIcon className="h-4 w-4 fill-current text-primary" />
              <span className="text-sm text-accent-foreground">
                Learn stocks with confidence
              </span>
            </div>

            <h1 className="hero-heading mb-6 text-5xl font-semibold leading-tight text-foreground md:text-6xl">
              Master <span className="text-gradient-emerald">stocks</span>,
              <br />
              one lesson at a time
            </h1>

            <p className="mb-12 max-w-lg text-xl text-muted-foreground">
              A guided course that teaches you how to understand stocks using
              real examples. No jargon, no intimidation.
            </p>

            <Link
              className="inline-flex rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] px-10 py-4 text-lg text-primary-foreground shadow-[0_16px_40px_rgba(22,163,74,0.24)] transition-all hover:scale-105 hover:shadow-[0_20px_48px_rgba(22,163,74,0.3)]"
              href="/onboarding"
            >
              Start learning
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-3xl border-4 border-primary/10 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
              <img
                alt="Stock market data visualization"
                className="h-96 w-full object-cover"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMGRhdGElMjB2aXN1YWxpemF0aW9uJTIwbWluaW1hbHxlbnwxfHx8fDE3NzM2MjgxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,197,94,0.02)_0%,rgba(22,163,74,0.24)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_72%)]" />
            </div>
          </div>
        </div>

        <ScrollReveal className="mt-20 w-full max-w-5xl" delayMs={60}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              description="Learn by doing, not by reading endless articles"
              icon={<BrainIcon className="h-6 w-6 text-primary" />}
              title="Interactive lessons"
            />
            <FeatureCard
              description="Study NVIDIA stock to understand real market concepts"
              icon={<TrendingUpIcon className="h-6 w-6 text-primary" />}
              title="Real examples"
            />
            <FeatureCard
              description="See your growth and earn your completion certificate"
              icon={<AwardIcon className="h-6 w-6 text-primary" />}
              title="Track progress"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-20 max-w-3xl text-center" delayMs={120}>
          <h3 className="mb-4 text-2xl font-semibold text-foreground">
            How it works
          </h3>
          <p className="mb-10 text-muted-foreground">
            A simple, gamified approach to learning stocks, just like your
            favorite language app, but for finance
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              ["1", "Learn", "Understand key concepts with clear explanations"],
              ["2", "Practice", "Apply what you learned with interactive exercises"],
              ["3", "Check", "Test your understanding with quick quizzes"],
              ["4", "Master", "Earn your certificate and gain confidence"],
            ].map(([number, title, description]) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  {number}
                </div>
                <h4 className="mb-2 font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
      <SiteFooter />
    </div>
  );
}

function FeatureCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-card/95 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(22,163,74,0.12)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#effcf3_0%,#dbfce7_100%)] ring-1 ring-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
