import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

const tahsilatBreadcrumbs = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Tahsilat", href: "/tahsilat" },
];

export default function TahsilatIslemlerPage() {
  return (
    <PlaceholderPage
      title="Tahsilat İşlemleri"
      description="Mevcut tahsilat kayıtlarını görüntüle ve yönet"
      breadcrumbs={[...tahsilatBreadcrumbs, { label: "Tahsilat İşlemleri" }]}
    />
  );
}
