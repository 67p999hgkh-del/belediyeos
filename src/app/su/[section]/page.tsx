import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { SuWorkspaceContent } from "@/components/su/SuWorkspaceContent";
import { getSuWorkspace, suWorkspaceIds, type SuWorkspaceId } from "@/lib/su-workspaces";

interface SuSectionPageProps {
  params: Promise<{ section: string }>;
}

function WorkspaceFallback() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-16">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}

export default async function SuSectionPage({ params }: SuSectionPageProps) {
  const { section: sectionId } = await params;
  const ws = getSuWorkspace(sectionId);

  if (!ws) notFound();

  return (
    <div className="space-y-4">
      <PageHeader
        title={ws.title}
        description={ws.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Su Hizmetleri", href: "/su" },
          { label: ws.title },
        ]}
      />

      <Suspense fallback={<WorkspaceFallback />}>
        <SuWorkspaceContent workspaceId={sectionId as SuWorkspaceId} />
      </Suspense>
    </div>
  );
}

export function generateStaticParams() {
  return suWorkspaceIds.map((section) => ({ section }));
}
