import { TahsilatOperasyonEkrani } from "@/components/tahsilat/TahsilatOperasyonEkrani";
import { TahsilatYeniHeader } from "@/components/tahsilat/TahsilatYeniHeader";

export default function YeniTahsilatPage() {
  return (
    <div>
      <TahsilatYeniHeader />
      <TahsilatOperasyonEkrani />
    </div>
  );
}
