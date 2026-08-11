import { redirect } from "next/navigation";
import {
  getMemurLeafRedirect,
  getMemurLegacySectionRedirect,
  getMemurWorkspace,
} from "@/lib/memur-workspaces";

interface MemurActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function MemurActionPage({ params }: MemurActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionPath = action.join("/");
  const redirectTo = getMemurLeafRedirect(sectionId, actionPath);

  if (redirectTo) {
    redirect(redirectTo);
  }

  const legacyRedirect = getMemurLegacySectionRedirect(sectionId);
  if (legacyRedirect) {
    redirect(legacyRedirect);
  }

  const ws = getMemurWorkspace(sectionId);
  if (ws) {
    redirect(ws.route);
  }

  redirect("/personel/memur");
}
