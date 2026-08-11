import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import {
  getSistemGroup,
  getSistemSection,
  getSistemSubMenuItem,
} from "@/lib/sistem-submenus";
import { notFound } from "next/navigation";

interface SistemActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function SistemActionPage({ params }: SistemActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getSistemSection(sectionId);
  const subItem = getSistemSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getSistemGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Sistem Yönetimi", href: "/sistem" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
