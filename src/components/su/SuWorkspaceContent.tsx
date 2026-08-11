"use client";

import type { SuWorkspaceId } from "@/lib/su-workspaces";
import { SuAboneWorkspace } from "./abone/SuAboneWorkspace";
import { SuWorkspaceShell } from "./SuWorkspaceShell";

interface SuWorkspaceContentProps {
  workspaceId: SuWorkspaceId;
}

export function SuWorkspaceContent({ workspaceId }: SuWorkspaceContentProps) {
  if (workspaceId === "abone") {
    return <SuAboneWorkspace />;
  }
  return <SuWorkspaceShell workspaceId={workspaceId} />;
}
