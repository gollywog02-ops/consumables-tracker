
export const dynamic = "force-static";

import ItemsForm from "./components/ItemsForm";
import LocationsForm from "./components/LocationsForm";
import TransactionsForm from "./components/TransactionsForm";
import LowStockList from "./components/LowStockList";

export default function Home() {
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <p>This local-only MVP stores data in your browser. No setup needed.</p>
      <LowStockList />
      <TransactionsForm />
      <ItemsForm />
      <LocationsForm />
      <p style={{ fontSize: 12, color: "#666" }}>Data is saved in this browser only. Use Backup to move it.</p>
    </main>
  );
}
