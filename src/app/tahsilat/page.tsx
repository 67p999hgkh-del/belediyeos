import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function TahsilatPage() {
  return (
    <PlaceholderPage
      title="Tahsilat"
      description="Üst menüden Tahsilat modülüne tıklayarak işlemlere erişebilirsiniz"
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Tahsilat" },
      ]}
    />
  );
}
