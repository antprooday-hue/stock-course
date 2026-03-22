"use client";

import Link from "next/link";

type GoogleAccountButtonProps = {
  disabled?: boolean;
  onClick: () => void;
  photoUrl?: string | null;
  signedInHref?: string;
  signedIn: boolean;
};

export function GoogleAccountButton({
  disabled = false,
  onClick,
  photoUrl,
  signedInHref,
  signedIn,
}: GoogleAccountButtonProps) {
  const sharedStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "2px solid #e5e7eb",
    background: "#fff",
    boxShadow: "0 4px 0 #e5e7eb",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    overflow: "hidden",
    textDecoration: "none",
  };

  const icon = signedIn && photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl}
      alt="Google account"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : signedIn ? (
    <span style={{ fontSize: 20 }}>👤</span>
  ) : (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: 22,
        height: 22,
        borderRadius: "50%",
        alignItems: "center",
        justifyContent: "center",
        background:
          "conic-gradient(from 180deg, #34a853 0 25%, #fbbc05 25% 50%, #ea4335 50% 75%, #4285f4 75% 100%)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    </span>
  );

  if (signedIn && signedInHref) {
    return (
      <Link
        href={signedInHref}
        style={sharedStyle}
        aria-label="Open account"
        title="Open account"
      >
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={sharedStyle}
      aria-label={signedIn ? "Open account" : "Log in with Google"}
      title={signedIn ? "Open account" : "Log in with Google"}
    >
      {icon}
    </button>
  );
}
