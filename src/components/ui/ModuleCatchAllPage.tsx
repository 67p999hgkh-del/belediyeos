import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

const slugLabels: Record<string, string> = {
  sicil: "Sicil Kayıt",
  "sicil-liste": "Sicil Listesi",
  tahakkuk: "Tahakkuk",
  fatura: "Fatura",
  sayac: "Sayaç Okuma",
  raporlar: "Raporlar",
  beyan: "Beyan",
  ruhsat: "Ruhsat",
  basvuru: "Başvuru",
  iskan: "İskan",
  liste: "Liste",
  bilgi: "Bilgiler",
  kadro: "Kadro",
  puantaj: "Puantaj",
  bordro: "Bordro",
  sgk: "SGK İşlemleri",
  kayit: "Kayıt",
  fis: "Muhasebe Fişi",
  butce: "Bütçe",
  mizan: "Mizan",
  belediye: "Belediye Seçimi",
  kullanici: "Kullanıcı İşlemleri",
  donem: "Dönem Seçimi",
  sifre: "Şifre İşlemleri",
  yedek: "Yedek Alma",
  "geri-yukle": "Yedekten Geri Yükleme",
  ayarlar: "Ayarlar",
};

interface ModuleCatchAllProps {
  moduleLabel: string;
  moduleHref: string;
  params: Promise<{ slug: string[] }>;
}

export async function ModuleCatchAllPage({
  moduleLabel,
  moduleHref,
  params,
}: ModuleCatchAllProps) {
  const { slug } = await params;
  const lastSlug = slug[slug.length - 1] ?? "sayfa";
  const title = slugLabels[lastSlug] ?? lastSlug.replace(/-/g, " ");

  return (
    <PlaceholderPage
      title={`${moduleLabel} — ${title}`}
      breadcrumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: moduleLabel, href: moduleHref },
        { label: title },
      ]}
    />
  );
}
