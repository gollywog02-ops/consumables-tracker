export const dynamic = "force-dynamic";
export default async function HealthPage() {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/health` : "/api/health", {cache:"no-store"});
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
