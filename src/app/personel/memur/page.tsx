import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function PersonelMemurPage() {
  return (
    <PlaceholderPage
      title="Personel (Memur)"
      description="Memur kadrosu, bordro ve SGK işlemleri"
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Personel (Memur)" },
      ]}
    />
  );
}
