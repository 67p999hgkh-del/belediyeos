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
      <div className="card flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
          🚧
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Geliştirme aşamasında</h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Bu sayfa bir sonraki adımda eklenecek. Ekran görüntüsünü paylaşırsanız aynı
          işlevselliği buraya taşıyabiliriz.
        </p>
      </div>
    </div>
  );
}
