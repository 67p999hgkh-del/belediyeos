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

export type OdemeYontemi = "nakit" | "kart" | "havale";

export interface TahsilatOzet {
  seciliAdet: number;
  anaPara: number;
  ceza: number;
  kdv: number;
  genelToplam: number;
}

const defaultFiltre = {
  sicilTipi: "tumu",
  yil: "tumu",
  donem: "tumu",
  veOncesi: true,
  gelirKodu: "tumu",
  refNo: "",
};

export function useTahsilatOperasyon() {
  const [aramaSekmesi, setAramaSekmesi] = useState<TahsilatAramaSekmesi>("su-isyeri");
  const [globalQuery, setGlobalQuery] = useState("");
  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [tekArama, setTekArama] = useState("");
  const [aramaDurumu, setAramaDurumu] = useState<TahsilatAramaDurumu>("idle");
  const [sicil, setSicil] = useState<TahsilatSicil | null>(null);
  const [sicilKey, setSicilKey] = useState<string | null>(null);
  const [tumBorclar, setTumBorclar] = useState<TahsilatBorcRow[]>([]);
  const [secili, setSecili] = useState<Record<string, boolean>>({});
  const [odemeTutarlari, setOdemeTutarlari] = useState<Record<string, string>>({});
  const [filtre, setFiltre] = useState(defaultFiltre);
  const [gelismisFiltre, setGelismisFiltre] = useState(false);

  const [odemeDrawerAcik, setOdemeDrawerAcik] = useState(false);
  const [successAcik, setSuccessAcik] = useState(false);
  const [odemeYontemi, setOdemeYontemi] = useState<OdemeYontemi>("nakit");
  const [alinanTutar, setAlinanTutar] = useState("");
  const [posRef, setPosRef] = useState("");
  const [havaleRef, setHavaleRef] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [veznePin, setVeznePin] = useState("");
  const [makbuzNo, setMakbuzNo] = useState("");

  const sekmeAramaMetni =
    aramaSekmesi === "su-isyeri" ? aboneParca.join("") : tekArama.replace(/\D/g, "");

  const filtrelenmisBorclar = useMemo(
    () => filtreleBorclar(tumBorclar, filtre),
    [tumBorclar, filtre],
  );

  const ozet = useMemo((): TahsilatOzet => {
    let seciliAdet = 0;
    let anaPara = 0;
    let ceza = 0;
    let kdv = 0;
    let genelToplam = 0;

    filtrelenmisBorclar.forEach((row) => {
      if (!secili[row.id]) return;
      seciliAdet += 1;
      const odeme = parseOdemeTutari(odemeTutarlari[row.id] ?? "", row.toplam);
      const oran = row.toplam > 0 ? odeme / row.toplam : 1;
      anaPara += row.anaPara * oran;
      ceza += row.ceza * oran;
      kdv += row.kdv * oran;
      genelToplam += odeme;
    });

    return { seciliAdet, anaPara, ceza, kdv, genelToplam };
  }, [filtrelenmisBorclar, secili, odemeTutarlari]);

  const sifirlaSecim = useCallback(() => {
    setSecili({});
    setOdemeTutarlari({});
  }, []);

  const uygulaSonuc = useCallback(
    (sonuc: NonNullable<ReturnType<typeof aramaSicil>> | null) => {
      if (!sonuc) {
        setSicil(null);
        setSicilKey(null);
        setTumBorclar([]);
        sifirlaSecim();
        setAramaDurumu("bulunamadi");
        return;
      }
      setSicil(sonuc.sicil);
      setSicilKey(sonuc.key);
      setTumBorclar(sonuc.borclar);
      sifirlaSecim();
      setAramaDurumu(sonuc.borclar.length === 0 ? "bulundu" : "bulundu");
    },
    [sifirlaSecim],
  );

  const calistirArama = useCallback(
    async (metin: string) => {
      const q = metin.trim();
      if (q.length < 2 && normalizeDigits(q).length < 4) {
        setAramaDurumu("idle");
        return;
      }
      setAramaDurumu("loading");
      await new Promise((r) => setTimeout(r, 350));
      try {
        uygulaSonuc(aramaSicil(q));
      } catch {
        setAramaDurumu("hata");
      }
    },
    [uygulaSonuc],
  );

  const handleSekmeArama = useCallback(() => {
    calistirArama(sekmeAramaMetni);
  }, [calistirArama, sekmeAramaMetni]);

  const handleGlobalArama = useCallback(() => {
    calistirArama(globalQuery);
  }, [calistirArama, globalQuery]);

  const toggleSatir = (row: TahsilatBorcRow, checked: boolean) => {
    setSecili((prev) => ({ ...prev, [row.id]: checked }));
    if (checked && !odemeTutarlari[row.id]) {
      setOdemeTutarlari((prev) => ({
        ...prev,
        [row.id]: row.toplam.toFixed(2).replace(".", ","),
      }));
    }
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

  const filtreleriTemizle = () => {
    setFiltre(defaultFiltre);
    setGelismisFiltre(false);
  };

  const odemeyeGec = () => {
    if (ozet.seciliAdet === 0) return;
    setAlinanTutar(ozet.genelToplam.toFixed(2).replace(".", ","));
    setOdemeDrawerAcik(true);
  };

  const tahsilatiTamamla = () => {
    if (veznePin.length < 4) return;
    if (odemeYontemi === "nakit") {
      const alinan = parseOdemeTutari(alinanTutar, ozet.genelToplam);
      if (alinan < ozet.genelToplam) return;
    }
    setMakbuzNo(`MK-${Date.now().toString().slice(-6)}`);
    setOdemeDrawerAcik(false);
    setSuccessAcik(true);
    setVeznePin("");
  };

  const yeniTahsilat = () => {
    setSuccessAcik(false);
    setOdemeDrawerAcik(false);
    setGlobalQuery("");
    setAboneParca(["", "", "", ""]);
    setTekArama("");
    setSicil(null);
    setSicilKey(null);
    setTumBorclar([]);
    sifirlaSecim();
    setFiltre(defaultFiltre);
    setAramaDurumu("idle");
    setAciklama("");
    setAlinanTutar("");
    setPosRef("");
    setHavaleRef("");
    setOdemeYontemi("nakit");
    setMakbuzNo("");
  };

  const paraUstu = useMemo(() => {
    const alinan = parseOdemeTutari(alinanTutar, 0);
    return Math.max(0, alinan - ozet.genelToplam);
  }, [alinanTutar, ozet.genelToplam]);

  return {
    aramaSekmesi,
    setAramaSekmesi,
    globalQuery,
    setGlobalQuery,
    aboneParca,
    setAboneParca,
    tekArama,
    setTekArama,
    aramaDurumu,
    sicil,
    sicilKey,
    tumBorclar,
    secili,
    odemeTutarlari,
    setOdemeTutarlari,
    filtre,
    setFiltre,
    gelismisFiltre,
    setGelismisFiltre,
    filtrelenmisBorclar,
    ozet,
    odemeDrawerAcik,
    setOdemeDrawerAcik,
    successAcik,
    odemeYontemi,
    setOdemeYontemi,
    alinanTutar,
    setAlinanTutar,
    posRef,
    setPosRef,
    havaleRef,
    setHavaleRef,
    aciklama,
    setAciklama,
    veznePin,
    setVeznePin,
    makbuzNo,
    paraUstu,
    handleSekmeArama,
    handleGlobalArama,
    toggleSatir,
    tumunuSec,
    filtreleriTemizle,
    odemeyeGec,
    tahsilatiTamamla,
    yeniTahsilat,
  };
}

function normalizeDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function useTahsilatKlavye(opts: {
  aramaSekmesi: TahsilatAramaSekmesi;
  odemeDrawerAcik: boolean;
  successAcik: boolean;
  onSekmeArama: () => void;
  onGlobalArama: () => void;
  onOdemeDrawerKapat: () => void;
  onSuccessKapat: () => void;
  onOdemeyeGec: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (opts.successAcik) return;
        if (opts.odemeDrawerAcik) {
          e.preventDefault();
          opts.onOdemeDrawerKapat();
        }
        return;
      }
      if (opts.odemeDrawerAcik || opts.successAcik) return;

      if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        const active = document.activeElement as HTMLElement | null;
        if (active?.dataset?.globalSearch === "true") {
          e.preventDefault();
          opts.onGlobalArama();
        }
      }
      if (e.key === "F9") {
        e.preventDefault();
        opts.onSekmeArama();
      }
      if (e.key === "F10" && opts.aramaSekmesi === "su-isyeri") {
        e.preventDefault();
        opts.onSekmeArama();
      }
      if (e.key === "F8") {
        e.preventDefault();
        opts.onOdemeyeGec();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opts]);
}
