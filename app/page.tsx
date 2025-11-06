
export const dynamic = "force-static";

import ItemsForm from "./components/ItemsForm";
import LocationsForm from "./components/LocationsForm";
import TransactionsForm from "./components/TransactionsForm";
import LowStockList from "./components/LowStockList";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Consumables Tracker (Local-Only)</h1>
      <p>This drop-in version stores data in your browser (no accounts or keys). Add items/locations, record transactions, and see low stock.</p>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link href="/backup">Backup / Restore</Link>
      </nav>
      <LowStockList />
      <TransactionsForm />
      <ItemsForm />
      <LocationsForm />
      <p style={{ fontSize: 12, color: "#666" }}>Note: data is saved in your browser. Use Backup/Restore to move data between devices.</p>
    </main>
  );
}
