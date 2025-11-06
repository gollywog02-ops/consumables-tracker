'use client';
import { lowStock } from "../../src/lib/store";
import { useEffect, useState } from "react";
export default function LowStockList() {
  const [rows, setRows] = useState<ReturnType<typeof lowStock>>([]);
  useEffect(()=>{ setRows(lowStock()); }, []);
  return (<div>
    <h3>Low Stock</h3>
    {rows.length === 0 ? <p className="muted">All good — no items at/below reorder point.</p> :
      <div className="table-wrap"><table>
        <thead><tr><th>Item</th><th>Location</th><th align="right">On hand</th><th align="right">ROP</th><th align="right">Max</th></tr></thead>
        <tbody>{rows.map((r, idx) => (<tr key={idx}>
          <td>{r.item.sku} — {r.item.name}</td>
          <td>{r.location.name}</td>
          <td align="right">{r.onHand}</td>
          <td align="right">{r.item.reorderPoint}</td>
          <td align="right">{r.item.maxLevel}</td>
        </tr>))}</tbody>
      </table></div>}
  </div>);
}
