
# Drop-in Local MVP (No Env Vars)

This bundle adds a local-only consumables tracker to your existing Next.js project.
- Data stored in **localStorage** (browser).
- Features: Items, Locations, Transactions, Low-Stock dashboard, Backup/Restore.

## How to install (1 minute)
1) Unzip this bundle.
2) Copy the `app/` and `src/` folders into your repo (merge with existing).
3) Commit & push → Vercel redeploys.
4) Visit your site: add an item/location, record a transaction, see **Low Stock**.

## Notes
- This is for quick use/testing. When ready, we’ll switch storage to Postgres without changing much UI.
- Data lives in the browser; use **Backup/Restore** to move data.
