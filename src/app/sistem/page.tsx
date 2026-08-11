import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SistemPage() {
  return (
    <PlaceholderPage
      title="Sistem"
      description="Kullanıcı, yedekleme ve sistem ayarları"
      breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Sistem" }]}
    />
  );
}
