import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getIsciGroup, getIsciSection, getIsciSubMenuItem } from "@/lib/isci-submenus";
import { notFound } from "next/navigation";

interface IsciActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function IsciActionPage({ params }: IsciActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getIsciSection(sectionId);
  const subItem = getIsciSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getIsciGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Personel (İşçi)", href: "/personel/isci" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
