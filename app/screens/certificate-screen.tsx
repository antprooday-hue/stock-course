"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  AwardIcon,
  DownloadIcon,
} from "../components/icons";
import {
  getCertificateId,
  getNickname,
  subscribeToHydration,
  subscribeToCourseStorage,
} from "../lib/course-storage";

export function CertificateScreen() {
  const router = useRouter();
  const storedNickname = useSyncExternalStore(
    subscribeToCourseStorage,
    getNickname,
    () => "Learner",
  );
  const storedCertificateId = useSyncExternalStore(
    subscribeToCourseStorage,
    getCertificateId,
    () => "SF-DEMO",
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const nickname = isHydrated ? storedNickname : "Learner";
  const certificateId = isHydrated ? storedCertificateId : "SF-DEMO";

  const completionDate = useMemo(
    () =>
      isHydrated
        ? new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "March 16, 2026",
    [isHydrated],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => router.push("/completion")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground transition-all hover:bg-primary/90"
            onClick={() => window.print()}
          >
            <DownloadIcon className="h-5 w-5" />
            Download / Print
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 print:py-0">
        <div className="print-certificate-shell rounded-3xl border-8 border-primary/10 bg-white p-12 shadow-2xl print:rounded-none print:border-0 print:p-16 print:shadow-none md:p-16">
          <div className="relative">
            <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-xl border-l-4 border-t-4 border-primary/30" />
            <div className="absolute right-0 top-0 h-16 w-16 rounded-tr-xl border-r-4 border-t-4 border-primary/30" />
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-bl-xl border-b-4 border-l-4 border-primary/30" />
            <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-xl border-b-4 border-r-4 border-primary/30" />

            <div className="py-8 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-white">
                <AwardIcon className="h-10 w-10" />
              </div>

              <h1 className="mb-2 text-4xl font-semibold text-foreground md:text-5xl">
                Certificate of Completion
              </h1>
              <div className="mx-auto mb-8 h-1 w-32 rounded-full bg-primary" />

              <p className="mb-4 text-lg text-muted-foreground">
                This certifies that
              </p>
              <h2 className="mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                {nickname}
              </h2>
              <p className="mb-3 text-lg text-muted-foreground">
                has successfully completed
              </p>
              <h3 className="mb-8 text-3xl font-semibold text-foreground">
                Beginner Stock Foundations
              </h3>

              <div className="mx-auto mb-10 max-w-2xl">
                <p className="leading-relaxed text-muted-foreground">
                  This course covered beginner-friendly concepts including ownership, fundraising, gains, dividends, exchanges, market cap, investing versus trading, risk, diversification, and chart exploration.
                </p>
              </div>

              <div className="mb-10 flex flex-col items-center justify-center gap-8 sm:flex-row">
                <CertificateDetail
                  label="Completion Date"
                  value={completionDate}
                />
                <div className="hidden h-12 w-px bg-border sm:block" />
                <CertificateDetail label="Completion Time" value="74 minutes" />
                <div className="hidden h-12 w-px bg-border sm:block" />
                <CertificateDetail label="Lessons Finished" value="10 lessons" />
              </div>

              <div className="inline-block">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40">
                    <AwardIcon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Official Seal</p>
              </div>

              <p className="mt-8 text-xs text-muted-foreground">
                Certificate ID: {certificateId}
              </p>
            </div>
          </div>
        </div>

        <div className="print:hidden mt-8 text-center text-sm text-muted-foreground">
          <p>Tip: Use your browser&apos;s print function to save this certificate as a PDF</p>
        </div>
      </div>
    </div>
  );
}

function CertificateDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}
