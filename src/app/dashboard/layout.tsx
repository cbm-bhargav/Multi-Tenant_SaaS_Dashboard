// import './globals.css'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Multi-Tenant SaaS',
//   description: 'Dynamic project management with Neon databases',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-100 min-h-screen">{children}</body>
//     </html>
//   )
// }

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sky-700 text-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold font-mono text-white">
            Multi-Tenant SaaS Dashboard
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}