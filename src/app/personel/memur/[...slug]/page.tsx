import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function MemurCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage
      moduleLabel="Personel (Memur)"
      moduleHref="/personel/memur"
      params={props.params}
    />
  );
}
