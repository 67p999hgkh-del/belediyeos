import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getImarItem, imarModuleItems } from "@/lib/imar-module";
import { getImarGroupForItem } from "@/lib/imar-submenus";
import { notFound } from "next/navigation";

interface ImarSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function ImarSectionPage({ params }: ImarSectionPageProps) {
  const { section: sectionId } = await params;
  const item = getImarItem(sectionId);

  if (!item) notFound();

  const parentGroup = getImarGroupForItem(sectionId);

  return (
    <PlaceholderPage
      title={item.label}
      description={item.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "İmar & Ruhsat", href: "/imar" },
        ...(parentGroup ? [{ label: parentGroup.label.replace(/^\d+\.\s/, "") }] : []),
        { label: item.label },
      ]}
    />
  );
}

export function generateStaticParams() {
  return imarModuleItems.map((item) => ({ section: item.id }));
}
