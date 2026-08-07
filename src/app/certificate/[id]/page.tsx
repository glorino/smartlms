import { notFound } from "next/navigation";
import CertificateView from "./certificate-view";

async function getCertificate(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/certificates/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const certificate = await getCertificate(params.id);

  if (!certificate) {
    notFound();
  }

  return <CertificateView certificate={certificate} />;
}
