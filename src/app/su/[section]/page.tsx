import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuickAction } from "@/components/ui/QuickAction";
import { getSuSection, suSections } from "@/lib/su-submenus";
import { notFound } from "next/navigation";

interface SuSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function SuSectionPage({ params }: SuSectionPageProps) {
  const { section: sectionId } = await params;
  const section = getSuSection(sectionId);
  if (!section) notFound();

  const Icon = section.icon;

  return (
    <div className="space-y-8">
      <PageHeader
        title={section.label}
        description={section.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Su Hizmetleri", href: "/su" },
          { label: section.label },
        ]}
      />

      <div className="card flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{section.label}</p>
          <p className="text-sm text-slate-500">
            {section.subMenus.length} işlem · Alt menüden devam edin
          </p>
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">İşlemler</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.subMenus.map((item) => (
            <QuickAction
              key={item.id}
              title={item.label}
              description={item.description}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Diğer Su Modülleri</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {suSections
            .filter((s) => s.id !== sectionId)
            .map((s) => {
              const SIcon = s.icon;
              return (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50"
                  >
                    <SIcon className="h-4 w-4 text-cyan-600" />
                    <span className="flex-1 text-sm font-medium text-slate-700">{s.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return suSections.map((s) => ({ section: s.id }));
}
