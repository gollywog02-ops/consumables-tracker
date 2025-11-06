'use client';
import { getDB, balancesByItemLocation, addTransaction } from "../../src/lib/store";
import { useMemo, useState } from "react";
export default function StockPage() {
  const [q, setQ] = useState("");
  const db = getDB();
  const locations = db.locations;

  const rows = useMemo(()=>{
    const bal = balancesByItemLocation();
    return db.items
      .filter(i => (i.sku + " " + i.name).toLowerCase().includes(q.toLowerCase()))
      .map(i => {
        const perLoc = locations.map(l => bal.get(`${i.id}::${l.id}`) ?? 0);
        const total = perLoc.reduce((a,b)=>a+b, 0);
        return { item: i, perLoc, total };
      })
      .sort((a,b)=> a.item.sku.localeCompare(b.item.sku));
  }, [db.items, locations, q, db.transactions]);

  function bump(itemId: string, locationId: string, delta: number) {
    addTransaction({ itemId, locationId, type: delta > 0 ? "receive" : "consume", qty: Math.abs(delta), ref: "quick" });
    setQ(q => q + ""); // trigger rerender
  }

  return (
    <main className="grid">
      <div className="toolbar">
        <div className="search">
          <input className="input" placeholder="Search SKU or name..." value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <span className="badge">Locations: {locations.length}</span>
        <span className="badge">Items: {rows.length}</span>
      </div>

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item</th>
                {locations.map(l => <th key={l.id} align="right">{l.name}</th>)}
                <th align="right">Total</th>
                <th align="right">ROP</th>
                <th align="right">Max</th>
                <th align="right">Quick</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, perLoc, total }) => (
                <tr key={item.id}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  {perLoc.map((n, i) => <td key={locations[i].id} align="right">{n}</td>)}
                  <td align="right">{total}</td>
                  <td align="right">{item.reorderPoint}</td>
                  <td align="right">{item.maxLevel}</td>
                  <td align="right">
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {locations.map(l => (
                        <span key={l.id} style={{ display: "inline-flex", gap: 6 }}>
                          <button className="button ghost" onClick={()=>bump(item.id, l.id, +1)}>+1 {l.name.slice(0,1)}</button>
                          <button className="button ghost" onClick={()=>bump(item.id, l.id, -1)}>-1 {l.name.slice(0,1)}</button>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
