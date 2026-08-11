import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function IsyeriCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="İşyeri" moduleHref="/isyeri" params={props.params} />
  );
}
