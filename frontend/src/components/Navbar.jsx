import { LogOut, Menu, X, Printer, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";

function Navbar({ setPage, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const menuItems = [
    ...(isAdmin ? [] : [{ id: "student", label: "Submit Print", icon: Printer }]),
    ...(isAdmin ? [] : [{ id: "jobs", label: "My Jobs", icon: FileText }]),
    ...(isAdmin ? [{ id: "admin", label: "Admin Panel", icon: ShieldCheck }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Printer size={20} />
            </div>
            <h1 className="text-xl font-bold hidden sm:block">QueueLess Print</h1>
            <h1 className="text-xl font-bold sm:hidden">QLP</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
              {isAdmin ? "Admin" : "Student"}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-slate-200 mt-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1">{isAdmin ? "Admin" : "Student"}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;