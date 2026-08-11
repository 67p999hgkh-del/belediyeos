import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function MuhasebePage() {
  return (
    <PlaceholderPage
      title="Muhasebe"
      description="Muhasebe, bütçe ve fiş işlemleri"
      breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Muhasebe" }]}
    />
  );
}
