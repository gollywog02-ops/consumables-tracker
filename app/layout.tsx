export const metadata = { title: "Consumables Tracker", description: "MVP starter" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui", margin: 0 }}>
        <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ margin: 0 }}>Consumables Tracker</h1>
            <nav><a href="/" style={{ marginRight: 16 }}>Home</a><a href="/health">Health</a></nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
