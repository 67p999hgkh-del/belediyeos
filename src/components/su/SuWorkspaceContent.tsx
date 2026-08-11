"use client";

import type { SuWorkspaceId } from "@/lib/su-workspaces";
import { SuAboneWorkspace } from "./abone/SuAboneWorkspace";
import { SuCezaIndirimiWorkspace } from "./ceza-indirimi/SuCezaIndirimiWorkspace";
import { SuDuzeltmeWorkspace } from "./duzeltme/SuDuzeltmeWorkspace";
import { SuEkBakiyeWorkspace } from "./ek-bakiye/SuEkBakiyeWorkspace";
import { SuElTerminaliWorkspace } from "./el-terminali/SuElTerminaliWorkspace";
import { SuFaturaWorkspace } from "./fatura/SuFaturaWorkspace";
import { SuGenelFaturaWorkspace } from "./genel-fatura/SuGenelFaturaWorkspace";
import { SuKanalizasyonWorkspace } from "./kanalizasyon/SuKanalizasyonWorkspace";
import { SuKrediWorkspace } from "./kredi/SuKrediWorkspace";
import { SuOnOdemeliSayacWorkspace } from "./on-odemeli/SuOnOdemeliSayacWorkspace";
import { SuWorkspaceShell } from "./SuWorkspaceShell";

interface SuWorkspaceContentProps {
  workspaceId: SuWorkspaceId;
}

export function SuWorkspaceContent({ workspaceId }: SuWorkspaceContentProps) {
  if (workspaceId === "abone") return <SuAboneWorkspace />;
  if (workspaceId === "fatura") return <SuFaturaWorkspace />;
  if (workspaceId === "duzeltme") return <SuDuzeltmeWorkspace />;
  if (workspaceId === "el-terminali") return <SuElTerminaliWorkspace />;
  if (workspaceId === "genel-fatura") return <SuGenelFaturaWorkspace />;
  if (workspaceId === "kredi") return <SuKrediWorkspace />;
  if (workspaceId === "ek-bakiye") return <SuEkBakiyeWorkspace />;
  if (workspaceId === "ceza-indirimi") return <SuCezaIndirimiWorkspace />;
  if (workspaceId === "kanalizasyon") return <SuKanalizasyonWorkspace />;
  if (workspaceId === "on-odemeli-sayac") return <SuOnOdemeliSayacWorkspace />;
  return <SuWorkspaceShell workspaceId={workspaceId} />;
}
