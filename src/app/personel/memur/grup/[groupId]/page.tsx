import { redirect } from "next/navigation";

interface MemurGroupPageProps {
  params: Promise<{ groupId: string }>;
}

/** Eski grup route'ları hub'a yönlendirilir — workspace mimarisine geçildi */
export default async function MemurGroupPage({ params }: MemurGroupPageProps) {
  await params;
  redirect("/personel/memur");
}
