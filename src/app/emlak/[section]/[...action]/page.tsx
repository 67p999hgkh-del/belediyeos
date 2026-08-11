import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getEmlakSection, getEmlakSubMenuItem } from "@/lib/emlak-submenus";
import { notFound } from "next/navigation";

interface EmlakActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function EmlakActionPage({ params }: EmlakActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getEmlakSection(sectionId);
  const subItem = getEmlakSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const title = subItem?.label ?? actionId.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={subItem?.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Emlak Vergisi", href: "/emlak" },
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
