import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function MuhasebeCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="Muhasebe" moduleHref="/muhasebe" params={props.params} />
  );
}
