import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getMemurItem, memurModuleItems } from "@/lib/memur-module";
import { getMemurGroup, getMemurSection } from "@/lib/memur-submenus";
import { notFound } from "next/navigation";

interface MemurSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function MemurSectionPage({ params }: MemurSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getMemurSection(sectionId);
  const directItem = getMemurItem(sectionId);
  const parentGroup = directItem ? getMemurGroup(directItem.group) : undefined;

  if (section) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={section.label}
          description={section.description}
          breadcrumbs={[
            { label: "Kontrol Paneli", href: "/" },
            { label: "Personel (Memur)", href: "/personel/memur" },
            ...(parentGroup
              ? [{ label: parentGroup.label, href: parentGroup.href }]
              : []),
            { label: section.label },
          ]}
        />

        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-3 text-sm text-amber-800">
          Alt menü maddeleri placeholder — BirNet ekran görüntüsüyle bire bir güncellenecek.
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {section.subMenus.length} alt işlem
            </p>
          </div>
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

        <Link href={parentGroup?.href ?? "/personel/memur"} className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          {parentGroup ? `${parentGroup.label} grubuna dön` : "Hub'a dön"}
        </Link>
      </div>
    );
  }

  if (directItem && !directItem.hasSubMenu) {
    return (
      <PlaceholderPage
        title={directItem.label}
        description={directItem.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (Memur)", href: "/personel/memur" },
          ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
          { label: directItem.label },
        ]}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return memurModuleItems.map((item) => ({ section: item.id }));
}
