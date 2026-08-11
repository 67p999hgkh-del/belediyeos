import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import {
  getEmlakItem,
  getEmlakSection,
} from "@/lib/emlak-submenus";
import { emlakModuleItems } from "@/lib/emlak-module";
import { notFound } from "next/navigation";

interface EmlakSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function EmlakSectionPage({ params }: EmlakSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getEmlakSection(sectionId);
  const directItem = getEmlakItem(sectionId);

  if (section) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={section.label}
          description={section.description}
          breadcrumbs={[
            { label: "Kontrol Paneli", href: "/" },
            { label: "Emlak Vergisi", href: "/emlak" },
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

        <Link href="/emlak" className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Emlak Vergisi&apos;ne dön
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
          { label: "Emlak Vergisi", href: "/emlak" },
          { label: directItem.label },
        ]}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return emlakModuleItems.map((item) => ({ section: item.id }));
}
