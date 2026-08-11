import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getIsyeriGroup, getIsyeriSection, getIsyeriSubMenuItem } from "@/lib/isyeri-submenus";
import { notFound } from "next/navigation";

interface IsyeriActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function IsyeriActionPage({ params }: IsyeriActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getIsyeriSection(sectionId);
  const subItem = getIsyeriSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getIsyeriGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "İşyeri Vergisi", href: "/isyeri" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
