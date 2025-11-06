'use client';
import { useState } from "react";
import { addLocation, getDB } from "../../src/lib/store";
export default function LocationsForm() {
  const [name, setName] = useState(""); const [notice, setNotice] = useState<string | null>(null);
  return (<div>
    <h3>Add Location</h3>
    <div className="row" style={{ gridTemplateColumns: "1fr auto" }}>
      <input className="input" placeholder="Location name" value={name} onChange={e=>setName(e.target.value)} />
      <button className="button secondary" onClick={()=>{
        if(!name) { setNotice("Name required"); return; }
        addLocation(name); setName(""); setNotice("Location added ✅");
      }}>Add</button>
    </div>
    {notice && <p className="muted">{notice}</p>}
    <details style={{ marginTop: 8 }}>
      <summary>Current Locations</summary>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(getDB().locations, null, 2)}</pre>
    </details>
  </div>);
}
