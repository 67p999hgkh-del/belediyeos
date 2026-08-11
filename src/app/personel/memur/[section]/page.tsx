import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { MemurWorkspaceContent } from "@/components/personel/memur/MemurWorkspaceContent";
import {
  getMemurLegacySectionRedirect,
  getMemurWorkspace,
  memurWorkspaceIds,
  type MemurWorkspaceId,
} from "@/lib/memur-workspaces";

interface MemurSectionPageProps {
  params: Promise<{ section: string }>;
}

function WorkspaceFallback() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-16">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}

export default async function MemurSectionPage({ params }: MemurSectionPageProps) {
  const { section: sectionId } = await params;

  const legacyRedirect = getMemurLegacySectionRedirect(sectionId);
  if (legacyRedirect && !getMemurWorkspace(sectionId)) {
    redirect(legacyRedirect);
  }

  const ws = getMemurWorkspace(sectionId);
  if (!ws) notFound();

  return (
    <div className="space-y-4">
      <PageHeader
        title={ws.title}
        description={ws.description}
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (Memur)", href: "/personel/memur" },
          { label: ws.title },
        ]}
      />

      <Suspense fallback={<WorkspaceFallback />}>
        <MemurWorkspaceContent workspaceId={sectionId as MemurWorkspaceId} />
      </Suspense>
    </div>
  );
}

export function generateStaticParams() {
  return memurWorkspaceIds.map((section) => ({ section }));
}
