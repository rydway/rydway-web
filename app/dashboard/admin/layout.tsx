import { Building2, FileText, Home, ShieldCheck, Users, Car, CreditCard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { cookies } from "next/headers"; // Wait, in a client or server context?
// We will use a standard layout approach here similar to other dashboards.

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { title: "Overview", href: "/dashboard/admin", icon: Home },
    { title: "Users & Profiles", href: "/dashboard/admin/users", icon: Users },
    { title: "Vehicles", href: "/dashboard/admin/vehicles", icon: Car },
    { title: "Bookings", href: "/dashboard/admin/bookings", icon: FileText },
    { title: "KYC & Verification", href: "/dashboard/admin/kyc", icon: ShieldCheck },
    { title: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 font-primary">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Admin Portal</h2>
          <p className="text-xs text-slate-500 font-secondary">Rydway Platform Management</p>
        </div>
        
        <nav className="px-4 pb-6 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.title} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
