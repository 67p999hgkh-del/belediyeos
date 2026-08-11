import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function ImarCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="İmar" moduleHref="/imar" params={props.params} />
  );
}
