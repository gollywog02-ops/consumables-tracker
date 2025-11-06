'use client';
import { useState } from "react";
import { addLocation, getDB } from "../../src/lib/store";

export default function LocationsForm() {
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Location</h3>
      <input placeholder="Location name" value={name} onChange={e=>setName(e.target.value)} />
      <button style={{ marginLeft: 8 }} onClick={()=>{
        if(!name) { setNotice("Name required"); return; }
        addLocation(name);
        setName("");
        setNotice("Location added ✅");
      }}>Add</button>
      {notice && <p>{notice}</p>}
      <details style={{ marginTop: 8 }}>
        <summary>Current Locations</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(getDB().locations, null, 2)}</pre>
      </details>
    </div>
  );
}
