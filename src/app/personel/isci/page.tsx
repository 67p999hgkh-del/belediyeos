import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function PersonelIsciPage() {
  return (
    <PlaceholderPage
      title="Personel (İşçi)"
      description="İşçi kadrosu, bordro ve puantaj"
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Personel (İşçi)" },
      ]}
    />
  );
}
