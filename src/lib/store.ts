
'use client';

export type Location = { id: string; name: string };
export type Item = { id: string; sku: string; name: string; unit: string; reorderPoint: number; maxLevel: number };
export type TxnType = "consume" | "receive" | "adjust" | "transfer_out" | "transfer_in";
export type Transaction = {
  id: string;
  itemId: string;
  locationId: string;
  type: TxnType;
  qty: number;
  ref?: string;
  createdAt: string;
};

type DB = {
  locations: Location[];
  items: Item[];
  transactions: Transaction[];
  version: number;
};

const KEY = "ct_local_db_v1";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function load(): DB {
  if (typeof window === "undefined") return { locations: [], items: [], transactions: [], version: 1 };
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seed: DB = {
      version: 1,
      locations: [{ id: uid(), name: "Main Store" }],
      items: [
        { id: uid(), sku: "GLV-NITRILE-M", name: "Nitrile Gloves (M)", unit: "box", reorderPoint: 5, maxLevel: 20 },
        { id: uid(), sku: "ETOH-70-500ML", name: "Ethanol 70% 500ml", unit: "bottle", reorderPoint: 3, maxLevel: 12 },
      ],
      transactions: []
    };
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    return { locations: [], items: [], transactions: [], version: 1 };
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function getDB(): DB { return load(); }

export function addLocation(name: string) {
  const db = load();
  db.locations.push({ id: uid(), name: name.trim() });
  save(db);
  return db.locations[db.locations.length - 1];
}

export function addItem(data: Omit<Item, "id">) {
  const db = load();
  const item = { ...data, id: uid() };
  db.items.push(item);
  save(db);
  return item;
}

export function addTransaction(data: Omit<Transaction, "id" | "createdAt">) {
  const db = load();
  const txn: Transaction = { ...data, id: uid(), createdAt: new Date().toISOString() };
  db.transactions.push(txn);
  save(db);
  return txn;
}

export function balancesByItemLocation() {
  const db = load();
  const map = new Map<string, number>();
  for (const t of db.transactions) {
    const key = `${t.itemId}::${t.locationId}`;
    const sign = (t.type === "receive" || t.type === "transfer_in") ? 1 : (t.type === "consume" || t.type === "transfer_out") ? -1 : 1;
    const prev = map.get(key) ?? 0;
    map.set(key, prev + sign * t.qty);
  }
  return map; // key: "itemId::locationId" -> onHand
}

export function lowStock() {
  const db = load();
  const bal = balancesByItemLocation();
  const results: { item: Item; location: Location; onHand: number }[] = [];
  for (const item of db.items) {
    for (const loc of db.locations) {
      const key = `${item.id}::${loc.id}`;
      const onHand = bal.get(key) ?? 0;
      if (onHand <= item.reorderPoint) {
        results.push({ item, location: loc, onHand });
      }
    }
  }
  return results;
}

export function exportJSON() {
  const db = load();
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "consumables_tracker_backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const db = JSON.parse(String(reader.result));
        if (!db || !Array.isArray(db.items) || !Array.isArray(db.locations) || !Array.isArray(db.transactions)) {
          throw new Error("Invalid file");
        }
        localStorage.setItem(KEY, JSON.stringify(db));
        resolve();
      } catch (e) { reject(e); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
