"use client";

import type { MemurWorkspaceId } from "@/lib/memur-workspaces";
import { MemurCekIslemleriWorkspace } from "./MemurCekIslemleriWorkspace";
import { MemurEkMesaiWorkspace } from "./MemurEkMesaiWorkspace";
import { MemurEmeklilikWorkspace } from "./MemurEmeklilikWorkspace";
import { MemurIslemGeriAlmaWorkspace } from "./MemurIslemGeriAlmaWorkspace";
import { MemurKesintiYatirimWorkspace } from "./MemurKesintiYatirimWorkspace";
import { MemurListelerWorkspace } from "./MemurListelerWorkspace";
import { MemurMaasBordroWorkspace } from "./MemurMaasBordroWorkspace";
import { MemurPersonelKartiWorkspace } from "./MemurPersonelKartiWorkspace";

interface MemurWorkspaceContentProps {
  workspaceId: MemurWorkspaceId;
}

export function MemurWorkspaceContent({ workspaceId }: MemurWorkspaceContentProps) {
  if (workspaceId === "personel-karti") return <MemurPersonelKartiWorkspace />;
  if (workspaceId === "maas-bordro") return <MemurMaasBordroWorkspace />;
  if (workspaceId === "ek-mesai") return <MemurEkMesaiWorkspace />;
  if (workspaceId === "emeklilik") return <MemurEmeklilikWorkspace />;
  if (workspaceId === "kesinti-yatirim") return <MemurKesintiYatirimWorkspace />;
  if (workspaceId === "cek-islemleri") return <MemurCekIslemleriWorkspace />;
  if (workspaceId === "listeler") return <MemurListelerWorkspace />;
  if (workspaceId === "islem-geri-alma") return <MemurIslemGeriAlmaWorkspace />;
  return null;
}
