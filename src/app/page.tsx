import Showroom from "@/components/showroom/Showroom";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <Showroom initialTab={tab} />;
}
