import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getSuSection, getSuSubMenuItem } from "@/lib/su-submenus";
import { notFound } from "next/navigation";

interface SuActionPageProps {
  params: Promise<{ section: string; action: string[] }>;
}

export default async function SuActionPage({ params }: SuActionPageProps) {
  const { section: sectionId, action } = await params;
  const actionId = action[action.length - 1];
  const section = getSuSection(sectionId);
  const subItem = getSuSubMenuItem(sectionId, actionId);

  if (!section) notFound();

  const title = subItem?.label ?? actionId.replace(/-/g, " ");
  const description = subItem?.description;

  return (
    <PlaceholderPage
      title={`${section.label} — ${title}`}
      description={description ?? `${section.label} modülü işlem ekranı`}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "Su Hizmetleri", href: "/su" },
        { label: section.label, href: section.href },
        { label: title },
      ]}
    />
  );
}
