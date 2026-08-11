import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { TabbedPlaceholderPage } from "@/components/isyeri/TabbedPlaceholderPage";
import { getIsyeriItem, isyeriModuleItems } from "@/lib/isyeri-module";
import { getIsyeriGroup, getIsyeriSection, getIsyeriTabGroup } from "@/lib/isyeri-submenus";
import { notFound } from "next/navigation";

interface IsyeriSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function IsyeriSectionPage({ params }: IsyeriSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getIsyeriSection(sectionId);
  const directItem = getIsyeriItem(sectionId);
  const tabGroup = getIsyeriTabGroup(sectionId);
  const parentGroup = directItem ? getIsyeriGroup(directItem.group) : undefined;

  if (section) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={section.label}
          description={section.description}
          breadcrumbs={[
            { label: "Kontrol Paneli", href: "/" },
            { label: "İşyeri Vergisi", href: "/isyeri" },
            ...(parentGroup
              ? [{ label: parentGroup.label, href: parentGroup.href }]
              : []),
            { label: section.label },
          ]}
        />

        <div className="card overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {section.subMenus.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <span className="text-slate-300">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <Link href={parentGroup?.href ?? "/isyeri"} className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {parentGroup ? `${parentGroup.label}'ne dön` : "İşyeri Vergisi'ne dön"}
        </Link>
      </div>
    );
  }

  if (directItem && !directItem.hasSubMenu) {
    const breadcrumbs = [
      { label: "Kontrol Paneli", href: "/" },
      { label: "İşyeri Vergisi", href: "/isyeri" },
      ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
      { label: directItem.label },
    ];

    if (tabGroup) {
      return <TabbedPlaceholderPage activeItemId={sectionId} breadcrumbs={breadcrumbs} />;
    }

    return (
      <PlaceholderPage
        title={directItem.label}
        description={directItem.description}
        breadcrumbs={breadcrumbs}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return isyeriModuleItems.map((s) => ({ section: s.id }));
}
