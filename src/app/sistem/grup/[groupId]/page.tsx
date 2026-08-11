import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSistemItem } from "@/lib/sistem-module";
import {
  getSistemGroup,
  getSistemSection,
  sistemFrequencyLabels,
  sistemWorkflowGroups,
} from "@/lib/sistem-submenus";
import { notFound } from "next/navigation";

interface SistemGroupPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function SistemGroupPage({ params }: SistemGroupPageProps) {
  const { groupId } = await params;
  const group = getSistemGroup(groupId);

  if (!group) notFound();

  const items = group.itemIds.map((id) => getSistemItem(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title={group.label}
        description={group.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Sistem Yönetimi", href: "/sistem" },
          { label: group.label },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
        Bu grupta <strong className="text-slate-900">{items.length} işlem</strong>{" "}
        mevcut — BirNet ile bire bir eşleştirilmiştir.
      </div>

      <div className="card overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            if (!item) return null;
            const Icon = item.icon;
            const section = getSistemSection(item.id);
            const subCount = section?.subMenus.length;
            const freq = sistemFrequencyLabels[item.frequency];

            const content = (
              <>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    item.disabled
                      ? "bg-slate-100 text-slate-400"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`font-medium ${item.disabled ? "text-slate-400" : "text-slate-900"}`}
                    >
                      {item.label}
                    </p>
                    {item.disabled ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Pasif
                      </span>
                    ) : (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${freq.className}`}
                      >
                        {freq.label}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {subCount ? `${subCount} alt işlem` : item.description}
                  </p>
                </div>
                {!item.disabled && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                )}
              </>
            );

            return (
              <li key={item.id}>
                {item.disabled ? (
                  <div className="flex cursor-not-allowed items-center gap-4 px-5 py-4 opacity-60">
                    {content}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <Link href="/sistem" className="btn-ghost inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Hub&apos;a dön
      </Link>
    </div>
  );
}

export function generateStaticParams() {
  return sistemWorkflowGroups.map((g) => ({ groupId: g.id }));
}
