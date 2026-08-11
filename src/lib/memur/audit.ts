export interface MemurAuditKayit {
  id: string;
  kullanici: string;
  islem: string;
  tarih: string;
  personel?: string;
  donem?: string;
  eskiDeger?: string;
  yeniDeger?: string;
  gerekce?: string;
  kaynakEkran?: string;
  islemSonucu?: "basarili" | "basarisiz" | "bekliyor";
}

const auditLog: MemurAuditKayit[] = [];

export function kaydetMemurAudit(
  kayit: Omit<MemurAuditKayit, "id" | "tarih"> & { tarih?: string },
): MemurAuditKayit {
  const entry: MemurAuditKayit = {
    id: `m-aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tarih:
      kayit.tarih ??
      new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ...kayit,
  };
  auditLog.unshift(entry);
  return entry;
}

export function getMemurAuditLog(limit = 30): MemurAuditKayit[] {
  return auditLog.slice(0, limit);
}

export function getMemurAuditByPersonel(sicilNo: string, limit = 10): MemurAuditKayit[] {
  return auditLog.filter((k) => k.personel === sicilNo).slice(0, limit);
}
