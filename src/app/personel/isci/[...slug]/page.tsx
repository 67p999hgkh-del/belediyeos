import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function IsciCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage
      moduleLabel="Personel (İşçi)"
      moduleHref="/personel/isci"
      params={props.params}
    />
  );
}
