import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function SuCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="Su" moduleHref="/su" params={props.params} />
  );
}
