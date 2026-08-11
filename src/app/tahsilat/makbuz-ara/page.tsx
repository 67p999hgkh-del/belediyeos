import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

const tahsilatBreadcrumbs = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Tahsilat", href: "/tahsilat" },
];

export default function MakbuzAraPage() {
  return (
    <PlaceholderPage
      title="Tahsilat Makbuzu Arama"
      description="Makbuz numarası veya sicil ile arama"
      breadcrumbs={[...tahsilatBreadcrumbs, { label: "Makbuz Arama" }]}
    />
  );
}
