import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import {
  getMuhasebeGroup,
  getMuhasebeSection,
  getMuhasebeSubMenuItem,
} from "@/lib/muhasebe-submenus";
import { notFound } from "next/navigation";

interface MuhasebeActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function MuhasebeActionPage({ params }: MuhasebeActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getMuhasebeSection(sectionId);
  const subItem = getMuhasebeSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const parentGroup = getMuhasebeGroup(section.group);
  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Muhasebe", href: "/muhasebe" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
