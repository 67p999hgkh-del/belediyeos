import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getIsciItem } from "@/lib/isci-module";
import {
  getIsciGroup,
  getIsciSection,
  isciFrequencyLabels,
  isciWorkflowGroups,
} from "@/lib/isci-submenus";
import { notFound } from "next/navigation";

interface IsciGroupPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function IsciGroupPage({ params }: IsciGroupPageProps) {
  const { groupId } = await params;
  const group = getIsciGroup(groupId);

  if (!group) notFound();

  const items = group.itemIds.map((id) => getIsciItem(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title={group.label}
        description={group.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (İşçi)", href: "/personel/isci" },
          { label: group.label },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
        Bu grupta <strong className="text-slate-900">{items.length} işlem</strong>{" "}
        mevcut. Alt menülü maddeler BirNet ile eşleştirilecektir.
      </div>

      <div className="card overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            if (!item) return null;
            const Icon = item.icon;
            const section = getIsciSection(item.id);
            const subCount = section?.subMenus.length;
            const freq = isciFrequencyLabels[item.frequency];

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${freq.className}`}
                      >
                        {freq.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {subCount ? `${subCount} alt işlem` : item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link href="/personel/isci" className="btn-ghost inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Hub&apos;a dön
      </Link>
    </div>
  );
}

export function generateStaticParams() {
  return isciWorkflowGroups.map((g) => ({ groupId: g.id }));
}
