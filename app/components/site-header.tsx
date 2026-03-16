"use client";

import Link from "next/link";
import { GraduationCapIcon, UserIcon } from "./icons";

type SiteHeaderProps = {
  nickname?: string;
  showProfile?: boolean;
};

export function SiteHeader({
  nickname = "Learner",
  showProfile = false,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          href="/"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCapIcon className="h-6 w-6" />
          </span>
          <span className="text-lg font-semibold">Stock Academy</span>
        </Link>

        {showProfile ? (
          <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{nickname}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
}

