import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getSuItem, suModuleItems } from "@/lib/su-module";
import { getSuSection } from "@/lib/su-submenus";
import { notFound } from "next/navigation";

interface SuSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function SuSectionPage({ params }: SuSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getSuSection(sectionId);
  const directItem = getSuItem(sectionId);

  if (section) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={section.label}
          description={section.description}
          breadcrumbs={[
            { label: "Kontrol Paneli", href: "/" },
            { label: "Su Hizmetleri", href: "/su" },
            { label: section.label },
          ]}
        />

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-medium text-slate-700">
              {section.subMenus.length} işlem mevcut
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

        <Link href="/su" className="btn-ghost inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Su Hizmetleri&apos;ne dön
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
          { label: "Su Hizmetleri", href: "/su" },
          { label: directItem.label },
        ]}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return suModuleItems.map((s) => ({ section: s.id }));
}
