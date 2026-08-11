import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

const slugLabels: Record<string, string> = {
  "makbuz-tekrar": "Makbuz Tekrar Yazımı",
  iptal: "Tahsilat İptali",
  "banka-aktar": "Banka Tahsilatı Aktarma",
  liste: "Tahsilat Listesi",
  duzeltme: "Tahsilat Düzeltme",
  raporlar: "Tahsilat Raporları",
  genel: "Genel Tahsilat Raporu",
  su: "Su Tahsilat Dökümü",
  emlak: "Emlak Tahsilat Dökümü",
  isyeri: "İşyeri Tahsilat Dökümü",
  imar: "İmar Tahsilat Dökümü",
  depozit: "Depozit Tahsilat Dökümü",
  fatura: "Fatura Tahsilat Dökümü",
  taksitli: "Taksitli Tahsilat Dökümü",
  vezne: "Vezne Dökümü",
};

export default async function TahsilatCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const lastSlug = slug[slug.length - 1] ?? "sayfa";
  const title = slugLabels[lastSlug] ?? lastSlug.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={title}
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Tahsilat", href: "/tahsilat" },
        { label: title },
      ]}
    />
  );
}
