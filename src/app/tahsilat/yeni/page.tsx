import { PageHeader } from "@/components/ui/PageHeader";
import { TahsilatUbsForm } from "@/components/tahsilat/TahsilatUbsForm";

export default function YeniTahsilatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tahsilat (Yeni)"
        description="UBS Modül — vezne tahsilat giriş ekranı (BirNet bire bir)"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Tahsilat", href: "/tahsilat" },
          { label: "Tahsilat (Yeni)" },
        ]}
      />

      <TahsilatUbsForm />
    </div>
  );
}
