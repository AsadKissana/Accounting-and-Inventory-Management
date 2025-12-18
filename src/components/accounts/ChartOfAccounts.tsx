import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

type Account = {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  parentAccount?: string;
  balance: number;
};

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Account>>({
    type: 'Asset',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chartOfAccounts');
    if (saved) {
      setAccounts(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleAccounts: Account[] = [
      //   { id: '1', code: '1000', name: 'Cash', type: 'Asset', balance: 50000 },
      //   { id: '2', code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 25000 },
      //   { id: '3', code: '1200', name: 'Inventory', type: 'Asset', balance: 35000 },
      //   { id: '4', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 15000 },
      //   { id: '5', code: '3000', name: 'Capital', type: 'Equity', balance: 100000 },
      //   { id: '6', code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 0 },
      //   { id: '7', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 0 },
      //   { id: '8', code: '5100', name: 'Salaries Expense', type: 'Expense', balance: 0 },
      // ];

  /* =======================
     ASSETS
  ======================= */
  { id: '1', code: '1001', name: 'Cash in Hand', type: 'Asset', balance: 0 },
  { id: '2', code: '1002', name: 'Bank Account', type: 'Asset', balance: 0 },

  { id: '3', code: '1101', name: 'Accounts Receivable - Trade Debtors', type: 'Asset', balance: 0 },

  { id: '4', code: '1201', name: 'Medicines Inventory', type: 'Asset', balance: 0 },
  { id: '5', code: '1202', name: 'Vaccines Inventory', type: 'Asset', balance: 0 },
  { id: '6', code: '1203', name: 'Pet Food Inventory', type: 'Asset', balance: 0 },
  { id: '7', code: '1204', name: 'Veterinary Equipment Inventory', type: 'Asset', balance: 0 },

  { id: '8', code: '1301', name: 'Prepaid Rent', type: 'Asset', balance: 0 },
  { id: '9', code: '1302', name: 'Prepaid Insurance', type: 'Asset', balance: 0 },

  { id: '10', code: '1401', name: 'Clinic Equipment', type: 'Asset', balance: 0 },
  { id: '11', code: '1402', name: 'Laboratory Equipment', type: 'Asset', balance: 0 },
  { id: '12', code: '1403', name: 'Furniture & Fixtures', type: 'Asset', balance: 0 },
  { id: '13', code: '1404', name: 'Accumulated Depreciation', type: 'Asset', balance: 0 },

  /* =======================
     LIABILITIES
  ======================= */
  { id: '14', code: '2001', name: 'Accounts Payable - Suppliers', type: 'Liability', balance: 0 },
  { id: '15', code: '2002', name: 'Salaries Payable', type: 'Liability', balance: 0 },
  { id: '16', code: '2003', name: 'Tax Payable', type: 'Liability', balance: 0 },
  { id: '17', code: '2101', name: 'Bank Loan', type: 'Liability', balance: 0 },

  /* =======================
     EQUITY
  ======================= */
  { id: '18', code: '3001', name: 'Owner Capital', type: 'Equity', balance: 0 },
  { id: '19', code: '3002', name: 'Owner Drawings', type: 'Equity', balance: 0 },
  { id: '20', code: '3003', name: 'Retained Earnings', type: 'Equity', balance: 0 },

  /* =======================
     REVENUE
  ======================= */
  { id: '21', code: '4001', name: 'Medicine Sales', type: 'Revenue', balance: 0 },
  { id: '22', code: '4002', name: 'Vaccine Sales', type: 'Revenue', balance: 0 },
  { id: '23', code: '4003', name: 'Pet Food Sales', type: 'Revenue', balance: 0 },
  { id: '24', code: '4004', name: 'Equipment Sales', type: 'Revenue', balance: 0 },
  { id: '25', code: '4005', name: 'Clinical Services Income', type: 'Revenue', balance: 0 },

  /* =======================
     COST OF GOODS SOLD
  ======================= */
  { id: '26', code: '5001', name: 'Cost of Medicines Sold', type: 'Expense', balance: 0 },
  { id: '27', code: '5002', name: 'Cost of Vaccines Sold', type: 'Expense', balance: 0 },
  { id: '28', code: '5003', name: 'Cost of Pet Food Sold', type: 'Expense', balance: 0 },
  { id: '29', code: '5004', name: 'Cost of Equipment Sold', type: 'Expense', balance: 0 },

  /* =======================
     OPERATING EXPENSES
  ======================= */
  { id: '30', code: '6001', name: 'Salaries Expense', type: 'Expense', balance: 0 },
  { id: '31', code: '6002', name: 'Rent Expense', type: 'Expense', balance: 0 },
  { id: '32', code: '6003', name: 'Utilities Expense', type: 'Expense', balance: 0 },
  { id: '33', code: '6004', name: 'Marketing & Advertising Expense', type: 'Expense', balance: 0 },
  { id: '34', code: '6005', name: 'Depreciation Expense', type: 'Expense', balance: 0 },
  { id: '35', code: '6006', name: 'Repairs & Maintenance Expense', type: 'Expense', balance: 0 }
];

      setAccounts(sampleAccounts);
      localStorage.setItem('chartOfAccounts', JSON.stringify(sampleAccounts));
    }
  }, []);

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('chartOfAccounts', JSON.stringify(newAccounts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = accounts.map(acc =>
        acc.id === editingId ? { ...acc, ...formData } as Account : acc
      );
      saveAccounts(updated);
      setEditingId(null);
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        code: formData.code || '',
        name: formData.name || '',
        type: formData.type || 'Asset',
        balance: formData.balance || 0,
      };
      saveAccounts([...accounts, newAccount]);
    }
    setFormData({ type: 'Asset' });
    setShowForm(false);
  };

  const handleEdit = (account: Account) => {
    setFormData(account);
    setEditingId(account.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      saveAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.code.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setFormData({ type: 'Asset' });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Account Code</label>
                <input
                  type="text"
                  required
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Account Type</label>
                <select
                  value={formData.type || 'Asset'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Opening Balance</label>
                <input
                  type="number"
                  value={formData.balance || 0}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ type: 'Asset' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-gray-700">Account Name</th>
                <th className="px-4 py-3 text-left text-gray-700">Type</th>
                <th className="px-4 py-3 text-right text-gray-700">Balance</th>
                <th className="px-4 py-3 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{account.code}</td>
                  <td className="px-4 py-3 text-gray-900">{account.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      account.type === 'Asset' ? 'bg-green-100 text-green-800' :
                      account.type === 'Liability' ? 'bg-red-100 text-red-800' :
                      account.type === 'Equity' ? 'bg-blue-100 text-blue-800' :
                      account.type === 'Revenue' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
