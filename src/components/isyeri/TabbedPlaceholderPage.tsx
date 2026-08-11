"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Construction } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getIsyeriItem } from "@/lib/isyeri-module";
import { getIsyeriTabGroup } from "@/lib/isyeri-submenus";
import { cn } from "@/lib/utils";

interface TabbedPlaceholderPageProps {
  activeItemId: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function TabbedPlaceholderPage({
  activeItemId,
  breadcrumbs,
}: TabbedPlaceholderPageProps) {
  const pathname = usePathname();
  const tabGroup = getIsyeriTabGroup(activeItemId);
  const activeItem = getIsyeriItem(activeItemId);

  if (!tabGroup || !activeItem) return null;

  const tabs = tabGroup.tabs
    .map(({ itemId, tabLabel }) => {
      const item = getIsyeriItem(itemId);
      return item ? { ...item, tabLabel } : null;
    })
    .filter(Boolean) as (NonNullable<ReturnType<typeof getIsyeriItem>> & {
    tabLabel: string;
  })[];

  return (
    <div>
      <PageHeader
        title={tabGroup.label}
        description={activeItem.description}
        breadcrumbs={breadcrumbs}
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || tab.id === activeItemId;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "rounded-t-lg px-4 py-2.5 text-sm font-medium transition",
                isActive
                  ? "border-b-2 border-orange-500 text-orange-700"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              {tab.tabLabel}
            </Link>
          );
        })}
      </div>

      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Construction className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{activeItem.label}</h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Bu ekran bir sonraki sürümde aktif edilecektir. BirNet ekran görüntüsünü
          paylaşırsanız kurumsal standartlarda uygulanacaktır.
        </p>
      </div>
    </div>
  );
}
