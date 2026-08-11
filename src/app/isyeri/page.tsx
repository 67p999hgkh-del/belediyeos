import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function IsyeriPage() {
  return (
    <PlaceholderPage
      title="İşyeri"
      description="İşyeri vergisi işlemleri"
      breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "İşyeri" }]}
    />
  );
}
