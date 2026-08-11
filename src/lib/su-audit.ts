export interface SuAuditKayit {
  id: string;
  kullanici: string;
  islem: string;
  tarih: string;
  eskiDeger?: string;
  yeniDeger?: string;
  gerekce?: string;
  aciklama?: string;
}

const auditLog: SuAuditKayit[] = [];

export function kaydetSuAudit(
  kayit: Omit<SuAuditKayit, "id" | "tarih"> & { tarih?: string },
): SuAuditKayit {
  const entry: SuAuditKayit = {
    id: `aud-${Date.now()}`,
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

export function getSuAuditLog(limit = 20): SuAuditKayit[] {
  return auditLog.slice(0, limit);
}
