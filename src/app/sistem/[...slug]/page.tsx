import { ModuleCatchAllPage } from "@/components/ui/ModuleCatchAllPage";

export default function SistemCatchAll(props: { params: Promise<{ slug: string[] }> }) {
  return (
    <ModuleCatchAllPage moduleLabel="Sistem" moduleHref="/sistem" params={props.params} />
  );
}
