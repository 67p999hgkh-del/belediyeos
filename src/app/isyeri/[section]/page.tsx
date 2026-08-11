import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getIsyeriItem, isyeriModuleItems } from "@/lib/isyeri-module";
import { getIsyeriSection } from "@/lib/isyeri-submenus";
import { notFound } from "next/navigation";

interface IsyeriSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function IsyeriSectionPage({ params }: IsyeriSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getIsyeriSection(sectionId);
  const directItem = getIsyeriItem(sectionId);

  if (section) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={section.label}
          description={section.description}
          breadcrumbs={[
            { label: "Kontrol Paneli", href: "/" },
            { label: "İşyeri Vergisi", href: "/isyeri" },
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

        <Link href="/isyeri" className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          İşyeri Vergisi&apos;ne dön
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
          { label: "İşyeri Vergisi", href: "/isyeri" },
          { label: directItem.label },
        ]}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return isyeriModuleItems.map((s) => ({ section: s.id }));
}
