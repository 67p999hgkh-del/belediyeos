import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getMemurGroup, getMemurSection, getMemurSubMenuItem } from "@/lib/memur-submenus";
import { notFound } from "next/navigation";

interface MemurActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function MemurActionPage({ params }: MemurActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getMemurSection(sectionId);
  const subItem = getMemurSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getMemurGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Personel (Memur)", href: "/personel/memur" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
