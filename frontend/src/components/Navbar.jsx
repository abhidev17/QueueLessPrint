import { LogOut, Menu, X, PrinterIcon, FileText, Settings } from "lucide-react";
import { useState } from "react";

function Navbar({ setPage, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "student", label: "Submit Print", icon: PrinterIcon },
    { id: "jobs", label: "My Jobs", icon: FileText },
    { id: "admin", label: "Admin Panel", icon: Settings }
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <PrinterIcon size={28} className="animate-bounce" />
            <h1 className="text-2xl font-bold hidden sm:block">QueueLess Print</h1>
            <h1 className="text-2xl font-bold sm:hidden">QLP</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium opacity-90">{user?.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200"
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
          <div className="md:hidden pb-4 border-t border-white border-opacity-20">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-white border-opacity-20 mt-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-sm opacity-75">Signed in as</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white hover:bg-opacity-10 transition-all"
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