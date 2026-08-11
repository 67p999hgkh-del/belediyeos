import { Suspense } from "react";
import { MakbuzTekrarEkrani } from "@/components/tahsilat/MakbuzTekrarEkrani";
import { MakbuzTekrarHeader } from "@/components/tahsilat/MakbuzTekrarHeader";

export default function MakbuzTekrarPage() {
  return (
    <div>
      <MakbuzTekrarHeader />
      <Suspense
        fallback={
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
            Yükleniyor...
          </div>
        }
      >
        <MakbuzTekrarEkrani />
      </Suspense>
    </div>
  );
}
