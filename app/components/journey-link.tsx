"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import {
  navigateWithJourney,
  type JourneyIntent,
} from "../lib/journey-motion";

type JourneyLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href"
> &
  LinkProps & {
    href: string;
    intent?: JourneyIntent;
  };

export function JourneyLink({
  href,
  intent = "forward",
  onClick,
  target,
  ...props
}: JourneyLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          target === "_blank"
        ) {
          return;
        }

        event.preventDefault();
        navigateWithJourney(router, href, intent);
      }}
      target={target}
    />
  );
}
