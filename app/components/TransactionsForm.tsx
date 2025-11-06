'use client';
import { useMemo, useState } from "react";
import { addTransaction, getDB, balancesByItemLocation } from "../../src/lib/store";

export default function TransactionsForm() {
  const db = getDB();
  const [itemId, setItemId] = useState(db.items[0]?.id ?? "");
  const [locationId, setLocationId] = useState(db.locations[0]?.id ?? "");
  const [type, setType] = useState<"consume"|"receive"|"adjust"|"transfer_out"|"transfer_in">("receive");
  const [qty, setQty] = useState(1);
  const [ref, setRef] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const onHand = useMemo(()=>{
    const bal = balancesByItemLocation();
    const key = `${itemId}::${locationId}`;
    return bal.get(key) ?? 0;
  }, [itemId, locationId]);

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Record Transaction</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <select value={itemId} onChange={e=>setItemId(e.target.value)}>
          {db.items.map(i => <option key={i.id} value={i.id}>{i.sku} — {i.name}</option>)}
        </select>
        <select value={locationId} onChange={e=>setLocationId(e.target.value)}>
          {db.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="receive">receive (+)</option>
          <option value="consume">consume (-)</option>
          <option value="adjust">adjust (+/-)</option>
          <option value="transfer_in">transfer in (+)</option>
          <option value="transfer_out">transfer out (-)</option>
        </select>
        <input type="number" min="0" value={qty} onChange={e=>setQty(parseFloat(e.target.value||"0"))} />
        <input placeholder="Ref (optional)" value={ref} onChange={e=>setRef(e.target.value)} />
        <div>On hand now (calculated): <b>{onHand}</b></div>
      </div>
      <button style={{ marginTop: 8 }} onClick={()=>{
        if (!itemId || !locationId || !qty) { setNotice("Please select item/location and qty"); return; }
        addTransaction({ itemId, locationId, type, qty, ref });
        setQty(1); setRef("");
        setNotice("Saved ✅");
      }}>Save</button>
      {notice && <p>{notice}</p>}
    </div>
  );
}
