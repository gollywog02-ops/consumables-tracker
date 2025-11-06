
import "./globals.css";

export const metadata = { title: "Consumables Tracker", description: "Local MVP" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <div className="container">
        <header className="navbar">
          <div className="brand">🧪 Consumables Tracker</div>
          <nav className="navlinks">
            <a href="/">Home</a>
            <a href="/stock">Stock</a>
            <a href="/backup">Backup</a>
          </nav>
        </header>
        {children}
      </div>
    </body></html>
  );
}
