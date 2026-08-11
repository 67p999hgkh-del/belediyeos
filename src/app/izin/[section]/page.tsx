import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { getIzinItem, izinModuleItems } from "@/lib/izin-module";
import { getIzinGroupForItem } from "@/lib/izin-submenus";
import { notFound } from "next/navigation";

interface IzinSectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function IzinSectionPage({ params }: IzinSectionPageProps) {
  const { section: sectionId } = await params;
  const item = getIzinItem(sectionId);

  if (!item) notFound();

  const parentGroup = getIzinGroupForItem(sectionId);

  return (
    <PlaceholderPage
      title={item.label}
      description={item.description}
      breadcrumbs={[
        { label: "Kontrol Paneli", href: "/" },
        { label: "İzin Yönetimi", href: "/izin" },
        ...(parentGroup ? [{ label: parentGroup.label, href: parentGroup.href }] : []),
        { label: item.label },
      ]}
    />
  );
}

export function generateStaticParams() {
  return izinModuleItems.map((item) => ({ section: item.id }));
}
