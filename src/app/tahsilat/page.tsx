import Link from "next/link";
import { Plus } from "lucide-react";
import { tahsilatActions } from "@/lib/modules";
import { ActionCard } from "@/components/ui/ActionCard";
import { PageHeader } from "@/components/ui/PageHeader";

const groups = [
  { key: "islem" as const, title: "Günlük İşlemler" },
  { key: "rapor" as const, title: "Raporlar ve Dökümler" },
  { key: "diger" as const, title: "Arama ve Düzeltme" },
];

export default function TahsilatPage() {
  return (
    <div>
      <PageHeader
        title="Tahsilat"
        description="Vezne tahsilat işlemleri, makbuz ve raporlar"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tahsilat" },
        ]}
        action={
          <Link href="/tahsilat/yeni" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Tahsilat
          </Link>
        }
      />

      {groups.map((group) => {
        const actions = tahsilatActions.filter((a) => a.group === group.key);
        return (
          <section key={group.key} className="mb-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {group.title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  label={action.label}
                  href={action.href}
                  icon={action.icon}
                  shortcut={action.shortcut}
                  variant={action.variant}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
