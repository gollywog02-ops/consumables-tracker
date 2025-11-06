'use client';
import { exportJSON, importJSON, getDB } from "../../src/lib/store";
import { useState } from "react";

export default function BackupPage() {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h2>Backup / Restore</h2>
      <button onClick={()=>exportJSON()}>Download backup</button>
      <div>
        <input type="file" accept="application/json" onChange={async (e)=>{
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            await importJSON(f);
            setMsg("Import complete ✅. Reload the page to see changes.");
          } catch (e:any) {
            setMsg("Import failed: " + e.message);
          }
        }} />
      </div>
      <details>
        <summary>Preview current data</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(getDB(), null, 2)}</pre>
      </details>
      {msg && <p>{msg}</p>}
    </main>
  );
}
