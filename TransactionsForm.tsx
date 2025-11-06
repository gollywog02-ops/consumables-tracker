'use client';
import { useMemo, useState } from "react";
import { addTransaction, getDB, balancesByItemLocation } from "../../src/lib/store";
export default function TransactionsForm() {
  const db = getDB();
  const [itemId, setItemId] = useState(db.items[0]?.id ?? "");
  const [locationId, setLocationId] = useState(db.locations[0]?.id ?? "");
  const [type, setType] = useState<"consume"|"receive"|"adjust"|"transfer_out"|"transfer_in">("receive");
  const [qty, setQty] = useState(1); const [ref, setRef] = useState(""); const [notice, setNotice] = useState<string | null>(null);
  const onHand = useMemo(()=>{ const bal = balancesByItemLocation(); return bal.get(`${itemId}::${locationId}`) ?? 0; }, [itemId, locationId]);
  return (<div>
    <h3>Record Transaction</h3>
    <div className="row">
      <select className="select" value={itemId} onChange={e=>setItemId(e.target.value)}>{db.items.map(i => <option key={i.id} value={i.id}>{i.sku} — {i.name}</option>)}</select>
      <select className="select" value={locationId} onChange={e=>setLocationId(e.target.value)}>{db.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
      <select className="select" value={type} onChange={e=>setType(e.target.value as any)}>
        <option value="receive">receive (+)</option>
        <option value="consume">consume (-)</option>
        <option value="adjust">adjust (+/-)</option>
        <option value="transfer_in">transfer in (+)</option>
        <option value="transfer_out">transfer out (-)</option>
      </select>
      <input className="input" type="number" min="0" value={qty} onChange={e=>setQty(parseFloat(e.target.value||"0"))} />
      <input className="input" placeholder="Ref (optional)" value={ref} onChange={e=>setRef(e.target.value)} />
      <div>On hand: <b>{onHand}</b></div>
    </div>
    <button className="button" style={{ marginTop: 8 }} onClick={()=>{
      if (!itemId || !locationId || !qty) { setNotice("Select item, location and qty"); return; }
      addTransaction({ itemId, locationId, type, qty, ref }); setQty(1); setRef(""); setNotice("Saved ✅");
    }}>Save</button>
    {notice && <p className="muted">{notice}</p>}
  </div>);
}
