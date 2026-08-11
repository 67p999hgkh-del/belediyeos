import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function EmlakCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="Emlak" moduleHref="/emlak" params={props.params} />
  );
}
