"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  aramaSicil,
  filtreleBorclar,
  parseOdemeTutari,
  type TahsilatAramaDurumu,
  type TahsilatAramaSekmesi,
  type TahsilatBorcRow,
  type TahsilatSicil,
} from "@/lib/tahsilat-mock";

export const tahsildarlar = [
  { id: "ayse", label: "Ayşe Yılmaz" },
  { id: "mehmet", label: "Mehmet Kaya" },
  { id: "fatma", label: "Fatma Öztürk" },
];

const defaultFiltre = {
  sicilTipi: "tumu",
  yil: "tumu",
  donem: "tumu",
  veOncesi: true,
  gelirKodu: "tumu",
  refNo: "",
};

export function useTahsilatOperasyon() {
  const [tahsildar, setTahsildar] = useState("ayse");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [sifre, setSifre] = useState("");
  const [sifreOk, setSifreOk] = useState<boolean | null>(null);

  const [hizliArama, setHizliArama] = useState("");
  const [hizliAramaAcik, setHizliAramaAcik] = useState(false);

  const [aramaSekmesi, setAramaSekmesi] = useState<TahsilatAramaSekmesi>("su-isyeri");
  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [tekArama, setTekArama] = useState("");
  const [aramaDurumu, setAramaDurumu] = useState<TahsilatAramaDurumu>("idle");

  const [sicil, setSicil] = useState<TahsilatSicil | null>(null);
  const [tumBorclar, setTumBorclar] = useState<TahsilatBorcRow[]>([]);
  const [secili, setSecili] = useState<Record<string, boolean>>({});
  const [odemeTutarlari, setOdemeTutarlari] = useState<Record<string, string>>({});
  const [filtre, setFiltre] = useState(defaultFiltre);

  const [cekNo, setCekNo] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [kayitDurumu, setKayitDurumu] = useState<"idle" | "loading" | "basarili" | "hata">("idle");
  const [kayitMesaj, setKayitMesaj] = useState("");

  const sekmeAramaMetni =
    aramaSekmesi === "su-isyeri" ? aboneParca.join("") : tekArama.replace(/\D/g, "");

  const filtrelenmisBorclar = useMemo(
    () => filtreleBorclar(tumBorclar, filtre),
    [tumBorclar, filtre],
  );

  const odemeTutari = useMemo(() => {
    return filtrelenmisBorclar.reduce((sum, row) => {
      if (!secili[row.id]) return sum;
      return sum + parseOdemeTutari(odemeTutarlari[row.id] ?? "", row.toplam);
    }, 0);
  }, [filtrelenmisBorclar, secili, odemeTutarlari]);

  const sifirlaSecim = useCallback(() => {
    setSecili({});
    setOdemeTutarlari({});
  }, []);

  const uygulaSonuc = useCallback(
    (sonuc: ReturnType<typeof aramaSicil>) => {
      if (!sonuc) {
        setSicil(null);
        setTumBorclar([]);
        sifirlaSecim();
        setAramaDurumu("bulunamadi");
        return;
      }
      setSicil(sonuc.sicil);
      setTumBorclar(sonuc.borclar);
      sifirlaSecim();
      setAramaDurumu("bulundu");
      setKayitDurumu("idle");
      setKayitMesaj("");
    },
    [sifirlaSecim],
  );

  const calistirArama = useCallback(
    async (metin: string) => {
      const q = metin.trim();
      if (q.length < 2 && q.replace(/\D/g, "").length < 4) return;
      setAramaDurumu("loading");
      setKayitDurumu("idle");
      await new Promise((r) => setTimeout(r, 300));
      try {
        uygulaSonuc(aramaSicil(q));
      } catch {
        setSicil(null);
        setTumBorclar([]);
        setAramaDurumu("hata");
      }
    },
    [uygulaSonuc],
  );

  const handleSekmeArama = useCallback(() => {
    calistirArama(sekmeAramaMetni);
  }, [calistirArama, sekmeAramaMetni]);

  const handleHizliArama = useCallback(() => {
    calistirArama(hizliArama);
  }, [calistirArama, hizliArama]);

  const handleSifreBlur = () => {
    if (!sifre) {
      setSifreOk(null);
      return;
    }
    setSifreOk(sifre.length >= 4);
  };

  const toggleSatir = (row: TahsilatBorcRow, checked: boolean) => {
    setSecili((prev) => ({ ...prev, [row.id]: checked }));
    if (checked && !odemeTutarlari[row.id]) {
      setOdemeTutarlari((prev) => ({
        ...prev,
        [row.id]: row.toplam.toFixed(2).replace(".", ","),
      }));
    }
    setKayitDurumu("idle");
  };

  const tumunuSec = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    const tutarlar: Record<string, string> = { ...odemeTutarlari };
    filtrelenmisBorclar.forEach((row) => {
      next[row.id] = checked;
      if (checked) tutarlar[row.id] = row.toplam.toFixed(2).replace(".", ",");
    });
    setSecili(next);
    setOdemeTutarlari(tutarlar);
  };

  const handleKaydet = useCallback(async () => {
    if (!sicil) {
      setKayitDurumu("hata");
      setKayitMesaj("Önce sicil sorgulaması yapın.");
      return;
    }
    if (odemeTutari <= 0) {
      setKayitDurumu("hata");
      setKayitMesaj("Tahsilat için en az bir borç seçin.");
      return;
    }
    if (sifreOk === false) {
      setKayitDurumu("hata");
      setKayitMesaj("Geçerli vezne şifresi girin.");
      return;
    }
    setKayitDurumu("loading");
    setKayitMesaj("Tahsilat kaydediliyor...");
    await new Promise((r) => setTimeout(r, 500));
    setKayitDurumu("basarili");
    setKayitMesaj(`Tahsilat kaydedildi — Makbuz: MK-${Date.now().toString().slice(-6)}`);
  }, [sicil, odemeTutari, sifreOk]);

  const handleIptal = useCallback(() => {
    sifirlaSecim();
    setCekNo("");
    setAciklama("");
    setKayitDurumu("idle");
    setKayitMesaj("");
  }, [sifirlaSecim]);

  return {
    tahsildar,
    setTahsildar,
    tarih,
    setTarih,
    sifre,
    setSifre,
    sifreOk,
    handleSifreBlur,
    hizliArama,
    setHizliArama,
    hizliAramaAcik,
    setHizliAramaAcik,
    aramaSekmesi,
    setAramaSekmesi,
    aboneParca,
    setAboneParca,
    tekArama,
    setTekArama,
    aramaDurumu,
    sicil,
    tumBorclar,
    secili,
    odemeTutarlari,
    setOdemeTutarlari,
    filtre,
    setFiltre,
    filtrelenmisBorclar,
    odemeTutari,
    cekNo,
    setCekNo,
    aciklama,
    setAciklama,
    kayitDurumu,
    kayitMesaj,
    handleSekmeArama,
    handleHizliArama,
    toggleSatir,
    tumunuSec,
    handleKaydet,
    handleIptal,
  };
}

export function useTahsilatKlavye(opts: {
  aramaSekmesi: TahsilatAramaSekmesi;
  onSekmeArama: () => void;
  onKaydet: () => void;
  onIptal: () => void;
  onCikis: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
        opts.onCikis();
      }
      if (e.key === "F5") {
        e.preventDefault();
        opts.onIptal();
      }
      if (e.key === "F8") {
        e.preventDefault();
        opts.onKaydet();
      }
      if (e.key === "F9") {
        e.preventDefault();
        opts.onSekmeArama();
      }
      if (e.key === "F10" && opts.aramaSekmesi === "su-isyeri") {
        e.preventDefault();
        opts.onSekmeArama();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opts]);
}
