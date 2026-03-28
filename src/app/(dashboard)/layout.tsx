// Layout del dashboard — incluye sidebar y header para rutas autenticadas
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Sidebar */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
