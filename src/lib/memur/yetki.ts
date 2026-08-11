/** Personel (Memur) modülü yetki kontrolü — belediye config katmanına bağlanacak */

export type MemurYetkiIslem =
  | "VIEW_PERSONNEL"
  | "EDIT_PERSONNEL"
  | "EDIT_SALARY_INFO"
  | "CALCULATE_PAYROLL"
  | "RUN_13TH_SALARY"
  | "RUN_OVERTIME"
  | "RUN_RETIREMENT"
  | "MANAGE_DEDUCTIONS"
  | "PRINT_PAYROLL"
  | "ROLLBACK_PAYROLL";

const yetkiHaritasi: Record<MemurYetkiIslem, string[]> = {
  VIEW_PERSONNEL: ["Vezne Sorumlusu", "Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  EDIT_PERSONNEL: ["Sistem Yöneticisi", "İK Müdürü"],
  EDIT_SALARY_INFO: ["Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  CALCULATE_PAYROLL: ["Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  RUN_13TH_SALARY: ["Sistem Yöneticisi", "İK Müdürü"],
  RUN_OVERTIME: ["Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  RUN_RETIREMENT: ["Sistem Yöneticisi", "İK Müdürü"],
  MANAGE_DEDUCTIONS: ["Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  PRINT_PAYROLL: ["Vezne Sorumlusu", "Sistem Yöneticisi", "İK Müdürü", "Muhasebe Sorumlusu"],
  ROLLBACK_PAYROLL: ["Sistem Yöneticisi", "İK Müdürü"],
};

export function canMemurIslem(islem: MemurYetkiIslem, role: string): boolean {
  return yetkiHaritasi[islem]?.includes(role) ?? false;
}
