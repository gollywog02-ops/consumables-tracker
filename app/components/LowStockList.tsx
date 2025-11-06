'use client';
import { lowStock } from "../../src/lib/store";
import { useEffect, useState } from "react";
export default function LowStockList() {
  const [rows, setRows] = useState<ReturnType<typeof lowStock>>([]);
  useEffect(()=>{ setRows(lowStock()); }, []);
  return (<div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
    <h3 style={{ marginTop: 0 }}>Low Stock</h3>
    {rows.length === 0 ? <p>All good — no items at/below reorder point.</p> :
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr><th align="left">Item</th><th align="left">Location</th><th align="right">On hand</th><th align="right">ROP</th><th align="right">Max</th></tr></thead>
        <tbody>{rows.map((r, i)=>(<tr key={i}><td>{r.item.sku} — {r.item.name}</td><td>{r.location.name}</td><td align="right">{r.onHand}</td><td align="right">{r.item.reorderPoint}</td><td align="right">{r.item.maxLevel}</td></tr>))}</tbody>
      </table>}
  </div>);
}
