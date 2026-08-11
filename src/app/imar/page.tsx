import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function ImarPage() {
  return (
    <PlaceholderPage
      title="İmar"
      description="İmar ve ruhsat işlemleri"
      breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "İmar" }]}
    />
  );
}
