import { useState, useEffect } from 'react';
import { Save, Calendar } from 'lucide-react';

type OpeningBalance = {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  date: string;
};

export function AccountOpening() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [openingBalances, setOpeningBalances] = useState<OpeningBalance[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('chartOfAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }

    const savedOpenings = localStorage.getItem('openingBalances');
    if (savedOpenings) {
      setOpeningBalances(JSON.parse(savedOpenings));
    }
  }, []);

  const handleAmountChange = (accountId: string, type: 'debit' | 'credit', value: number) => {
    setOpeningBalances(prev => {
      const existing = prev.find(ob => ob.accountCode === accountId);
      if (existing) {
        return prev.map(ob =>
          ob.accountCode === accountId
            ? { ...ob, [type]: value, [type === 'debit' ? 'credit' : 'debit']: 0 }
            : ob
        );
      } else {
        const account = accounts.find(a => a.code === accountId);
        return [
          ...prev,
          {
            id: Date.now().toString(),
            accountCode: accountId,
            accountName: account?.name || '',
            debit: type === 'debit' ? value : 0,
            credit: type === 'credit' ? value : 0,
            date,
          },
        ];
      }
    });
  };

  const handleSave = () => {
    localStorage.setItem('openingBalances', JSON.stringify(openingBalances));
    alert('Opening balances saved successfully!');
  };

  const totalDebit = openingBalances.reduce((sum, ob) => sum + ob.debit, 0);
  const totalCredit = openingBalances.reduce((sum, ob) => sum + ob.credit, 0);
  const difference = totalDebit - totalCredit;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <label className="text-gray-700">Opening Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Opening Balances
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Account Code</th>
                <th className="px-4 py-3 text-left text-gray-700">Account Name</th>
                <th className="px-4 py-3 text-right text-gray-700">Debit</th>
                <th className="px-4 py-3 text-right text-gray-700">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((account) => {
                const opening = openingBalances.find(ob => ob.accountCode === account.code);
                return (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{account.code}</td>
                    <td className="px-4 py-3 text-gray-900">{account.name}</td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={opening?.debit || ''}
                        onChange={(e) => handleAmountChange(account.code, 'debit', parseFloat(e.target.value) || 0)}
                        className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={opening?.credit || ''}
                        onChange={(e) => handleAmountChange(account.code, 'credit', parseFloat(e.target.value) || 0)}
                        className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-gray-900">Total</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 py-3 text-gray-900">Difference</td>
                <td colSpan={2} className={`px-4 py-3 text-right ${difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(difference).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {difference !== 0 && <span className="ml-2 text-sm">({difference > 0 ? 'Debit' : 'Credit'} excess)</span>}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {difference !== 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Warning:</strong> Total debits and credits must be equal. Please adjust the amounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
