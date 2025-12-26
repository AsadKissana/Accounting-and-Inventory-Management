import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ChartOfAccounts } from './components/accounts/ChartOfAccounts';
import { AccountOpening } from './components/accounts/AccountOpening';
import { VoucherEntry } from './components/accounts/VoucherEntry';
import { VoucherPreview } from './components/accounts/VoucherPreview';
import { LedgerReport } from './components/accounts/LedgerReport';
import { TrialBalance } from './components/accounts/TrialBalance';
import { PurchaseOrder } from './components/inventory/PurchaseOrder';
import { POPrinting } from './components/inventory/POPrinting';
import { GRNEntry } from './components/inventory/GRNEntry';
import { GRNPreview } from './components/inventory/GRNPreview';
import { StockInquiry } from './components/inventory/StockInquiry';
import { StockLedger } from './components/inventory/StockLedger';
import { SaleOrder } from './components/sales/SaleOrder';
import { SOPrinting } from './components/sales/SOPrinting';
import { SaleInvoice } from './components/sales/SaleInvoice';
import { SaleReport } from './components/sales/SaleReport';
import { 
  BookOpen, 
  DollarSign, 
  FileText, 
  Eye, 
  BarChart3, 
  Scale,
  ShoppingCart,
  Printer,
  Package,
  Warehouse,
  TrendingUp,
  Receipt,
  Menu,
  X,
  Users
} from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  category: 'directors' | 'admin' | 'accounts' | 'inventory' | 'sales';
};

// Ensure top-level menus (Directors, Admin) appear first by placing them
// at the top of this list. The reduce below preserves the insertion order
// of categories, so placing them first keeps them above other modules.

const menuItems: MenuItem[] = [
  // 
  { id: 'dashboard', label: 'Dashboard', icon: Users, category: 'directors' },

  { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen, category: 'accounts' },
  { id: 'account-opening', label: 'Account Opening', icon: DollarSign, category: 'accounts' },
  { id: 'voucher-entry', label: 'Voucher Entry', icon: FileText, category: 'accounts' },
  { id: 'voucher-preview', label: 'Voucher Preview', icon: Eye, category: 'accounts' },
  { id: 'ledger-report', label: 'Ledger Report', icon: BarChart3, category: 'accounts' },
  { id: 'trial-balance', label: 'Trial Balance', icon: Scale, category: 'accounts' },
  { id: 'accounts-dashboard', label: 'Accounts Dashboard', icon: FileText, category: 'accounts' },
  { id: 'purchase-order', label: 'Purchase Order Entry', icon: ShoppingCart, category: 'inventory' },
  { id: 'po-printing', label: 'PO Printing', icon: Printer, category: 'inventory' },
  { id: 'grn-entry', label: 'GRN Entry', icon: Package, category: 'inventory' },
  { id: 'grn-preview', label: 'GRN Preview', icon: Eye, category: 'inventory' },
  { id: 'stock-inquiry', label: 'Stock Inquiry', icon: Warehouse, category: 'inventory' },
  { id: 'stock-ledger', label: 'Stock Ledger', icon: BarChart3, category: 'inventory' },
  { id: 'inventory-dashboard', label: 'Inventory Dashboard', icon: Warehouse, category: 'inventory' },
  { id: 'sale-order', label: 'Sale Order', icon: TrendingUp, category: 'sales' },
  { id: 'so-printing', label: 'SO Printing', icon: Printer, category: 'sales' },
  { id: 'sale-invoice', label: 'Sale Invoice', icon: Receipt, category: 'sales' },
  { id: 'sale-report', label: 'Sale Report', icon: BarChart3, category: 'sales' },
];

export default function App() {
  const [activeView, setActiveView] = useState('chart-of-accounts');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // support quick links via location.hash (e.g. #sale-invoice)
    const applyHash = () => {
      const h = window.location.hash?.replace('#','');
      if (h) setActiveView(h);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);


  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'chart-of-accounts': return <ChartOfAccounts />;
      case 'account-opening': return <AccountOpening />;
      case 'voucher-entry': return <VoucherEntry />;
      case 'voucher-preview': return <VoucherPreview />;
      case 'ledger-report': return <LedgerReport />;
      case 'trial-balance': return <TrialBalance />;
      case 'purchase-order': return <PurchaseOrder />;
      case 'po-printing': return <POPrinting />;
      case 'grn-entry': return <GRNEntry />;
      case 'grn-preview': return <GRNPreview />;
      case 'stock-inquiry': return <StockInquiry />;
      case 'stock-ledger': return <StockLedger />;
      case 'sale-order': return <SaleOrder />;
      case 'so-printing': return <SOPrinting />;
      case 'sale-invoice': return <SaleInvoice />;
      case 'sale-report': return <SaleReport />;
      default: return <ChartOfAccounts />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'directors': return 'Directors';
      case 'admin': return 'Admin';
      case 'accounts': return 'Accounts';
      case 'inventory': return 'Inventory';
      case 'sales': return 'Sales';
      default: return '';
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-blue-600">Vet Line International</h1>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-88px)]">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-gray-500 px-3 mb-2 uppercase tracking-wider">{getCategoryLabel(category)}</h3>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1 ${
                      activeView === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h2 className="text-gray-800">
            {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
          </h2>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
