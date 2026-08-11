/** Su modülü yetki kontrolü — belediye config katmanına bağlanacak */

export type SuYetkiIslem =
  | "duzeltme"
  | "ceza-indirimi"
  | "abone-kapama"
  | "abone-devir"
  | "fatura-iptal"
  | "on-odemeli-sistem";

const yetkiHaritasi: Record<SuYetkiIslem, string[]> = {
  duzeltme: ["Vezne Sorumlusu", "Sistem Yöneticisi", "Su Müdürü"],
  "ceza-indirimi": ["Vezne Sorumlusu", "Sistem Yöneticisi"],
  "abone-kapama": ["Vezne Sorumlusu", "Sistem Yöneticisi", "Su Müdürü"],
  "abone-devir": ["Vezne Sorumlusu", "Sistem Yöneticisi", "Su Müdürü"],
  "fatura-iptal": ["Vezne Sorumlusu", "Sistem Yöneticisi"],
  "on-odemeli-sistem": ["Vezne Sorumlusu", "Sistem Yöneticisi"],
};

export function canSuIslem(islem: SuYetkiIslem, role: string): boolean {
  return yetkiHaritasi[islem]?.includes(role) ?? false;
}
