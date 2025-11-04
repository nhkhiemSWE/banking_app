export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
    </main>
  )
}