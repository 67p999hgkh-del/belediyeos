import { redirect } from "next/navigation";
import { getLeafRedirect, getSuWorkspace } from "@/lib/su-workspaces";

interface SuActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function SuActionPage({ params }: SuActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionPath = action.join("/");
  const redirectTo = getLeafRedirect(sectionId, actionPath);

  if (redirectTo) {
    redirect(redirectTo);
  }

  const ws = getSuWorkspace(sectionId);
  if (ws) {
    redirect(ws.route);
  }

  redirect("/su");
}
