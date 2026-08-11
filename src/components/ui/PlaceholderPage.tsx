import { Construction } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PlaceholderPage({ title, description, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Construction className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Modül geliştirme aşamasında</h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Bu ekran bir sonraki sürümde aktif edilecektir. İş akışı ekran görüntüsünü
          paylaşırsanız kurumsal standartlarda uygulanacaktır.
        </p>
      </div>
    </div>
  );
}
