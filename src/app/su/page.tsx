import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SuPage() {
  return (
    <PlaceholderPage
      title="Su"
      description="Su abonelik ve faturalandırma işlemleri"
      breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Su" }]}
    />
  );
}
