import Navbar from "@/components/common/Navbar"

export default function AuthLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
