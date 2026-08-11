import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function IzinCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="İzin" moduleHref="/izin" params={props.params} />
  );
}
