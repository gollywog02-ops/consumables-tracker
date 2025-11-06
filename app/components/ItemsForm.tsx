
'use client';
import { useState } from "react";
import { addItem, getDB } from "@/lib/store";

export default function ItemsForm() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("ea");
  const [rop, setRop] = useState(1);
  const [max, setMax] = useState(10);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Item</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input placeholder="SKU" value={sku} onChange={e=>setSku(e.target.value)} />
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Unit (ea/box/...)" value={unit} onChange={e=>setUnit(e.target.value)} />
        <input placeholder="Reorder Point" type="number" value={rop} onChange={e=>setRop(parseInt(e.target.value||"0"))} />
        <input placeholder="Max Level" type="number" value={max} onChange={e=>setMax(parseInt(e.target.value||"0"))} />
      </div>
      <button style={{ marginTop: 8 }} onClick={()=>{
        if(!sku || !name) { setNotice("SKU and Name required"); return; }
        addItem({ sku, name, unit, reorderPoint: rop, maxLevel: max });
        setSku(""); setName(""); setUnit("ea"); setRop(1); setMax(10);
        setNotice("Item added ✅");
      }}>Add</button>
      {notice && <p>{notice}</p>}
      <details style={{ marginTop: 8 }}>
        <summary>Current Items</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(getDB().items, null, 2)}</pre>
      </details>
    </div>
  );
}
