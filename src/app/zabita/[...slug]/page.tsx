import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function ZabitaCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="Zabıta" moduleHref="/zabita" params={props.params} />
  );
}
