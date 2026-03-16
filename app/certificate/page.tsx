import type { Metadata } from "next";
import { CertificateScreen } from "../screens/certificate-screen";

export const metadata: Metadata = {
  title: "Certificate | Stock Academy",
  description: "Print-safe certificate of completion for the stock course.",
};

export default function CertificatePage() {
  return <CertificateScreen />;
}

