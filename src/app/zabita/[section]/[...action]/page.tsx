import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import {
  getZabitaGroup,
  getZabitaSection,
  getZabitaSubMenuItem,
} from "@/lib/zabita-submenus";
import { notFound } from "next/navigation";

interface ZabitaActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function ZabitaActionPage({ params }: ZabitaActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getZabitaSection(sectionId);
  const subItem = getZabitaSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getZabitaGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Zabıta", href: "/zabita" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
