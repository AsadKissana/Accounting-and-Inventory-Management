import { useState, useEffect } from 'react';
import { Printer, RefreshCw } from 'lucide-react';

export function TrialBalance() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [trialBalanceData, setTrialBalanceData] = useState<any[]>([]);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedAccounts = localStorage.getItem('chartOfAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }

    const savedVouchers = localStorage.getItem('vouchers');
    if (savedVouchers) {
      setVouchers(JSON.parse(savedVouchers));
    }
  };

  const generateTrialBalance = () => {
    const balances: any = {};

    // Initialize with opening balances
    accounts.forEach(account => {
      balances[account.code] = {
        code: account.code,
        name: account.name,
        type: account.type,
        debit: account.balance > 0 ? account.balance : 0,
        credit: account.balance < 0 ? Math.abs(account.balance) : 0,
      };
    });

    // Add voucher transactions
    vouchers.forEach(voucher => {
      if (voucher.date <= asOfDate) {
        voucher.lines.forEach((line: any) => {
          if (!balances[line.accountCode]) {
            balances[line.accountCode] = {
              code: line.accountCode,
              name: line.accountName,
              type: 'Unknown',
              debit: 0,
              credit: 0,
            };
          }
          balances[line.accountCode].debit += line.debit;
          balances[line.accountCode].credit += line.credit;
        });
      }
    });

    const trialBalanceArray = Object.values(balances).filter((account: any) => 
      account.debit !== 0 || account.credit !== 0
    );

    setTrialBalanceData(trialBalanceArray);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalDebit = trialBalanceData.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = trialBalanceData.reduce((sum, account) => sum + account.credit, 0);

  // Group by account type
  const groupedData = trialBalanceData.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-gray-700 mb-2">As of Date</label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateTrialBalance}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Generate
              </button>
            </div>
          </div>
          {trialBalanceData.length > 0 && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          )}
        </div>

        {trialBalanceData.length > 0 ? (
          <div id="printable">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 mb-2">Trial Balance</h2>
              <p className="text-gray-600">As of {asOfDate}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Account Code</th>
                    <th className="px-4 py-3 text-left text-gray-700">Account Name</th>
                    <th className="px-4 py-3 text-left text-gray-700">Type</th>
                    <th className="px-4 py-3 text-right text-gray-700">Debit</th>
                    <th className="px-4 py-3 text-right text-gray-700">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(groupedData).map(([type, accounts]) => [
                    <tr key={`header-${type}`} className="bg-gray-100">
                      <td colSpan={5} className="px-4 py-2 text-gray-900">{type}</td>
                    </tr>,
                    ...accounts.map((account: any, index: number) => (
                      <tr key={`${type}-${account.code}-${index}`} className="hover:bg-gray-50">
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
                          {account.debit > 0 ? `$${account.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {account.credit > 0 ? `$${account.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                      </tr>
                    ))
                  ])}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  {Math.abs(totalDebit - totalCredit) > 0.01 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-red-600">Difference</td>
                      <td colSpan={2} className="px-4 py-3 text-right text-red-600">
                        ${Math.abs(totalDebit - totalCredit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>

            {Math.abs(totalDebit - totalCredit) < 0.01 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center">✓ Trial Balance is in balance</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Click "Generate" to view trial balance</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable, #printable * {
            visibility: visible;
          }
          #printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
