import { useState, useEffect } from 'react';
import { Printer, Filter } from 'lucide-react';

export function LedgerReport() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ledgerData, setLedgerData] = useState<any[]>([]);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('chartOfAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }

    const savedVouchers = localStorage.getItem('vouchers');
    if (savedVouchers) {
      setVouchers(JSON.parse(savedVouchers));
    }
  }, []);

  const generateLedger = () => {
    if (!selectedAccount) return;

    const account = accounts.find(a => a.code === selectedAccount);
    if (!account) return;

    let transactions: any[] = [];
    let balance = account.balance || 0;

    // Add opening balance
    transactions.push({
      date: dateFrom || '2024-01-01',
      description: 'Opening Balance',
      voucherNo: '-',
      debit: account.balance > 0 ? account.balance : 0,
      credit: account.balance < 0 ? Math.abs(account.balance) : 0,
      balance: account.balance,
    });

    // Filter vouchers by date range and account
    vouchers.forEach(voucher => {
      const voucherDate = voucher.date;
      if (dateFrom && voucherDate < dateFrom) return;
      if (dateTo && voucherDate > dateTo) return;

      voucher.lines.forEach((line: any) => {
        if (line.accountCode === selectedAccount) {
          balance += line.debit - line.credit;
          transactions.push({
            date: voucher.date,
            description: line.description,
            voucherNo: voucher.voucherNo,
            debit: line.debit,
            credit: line.credit,
            balance: balance,
          });
        }
      });
    });

    setLedgerData(transactions);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedAccountData = accounts.find(a => a.code === selectedAccount);
  const totalDebit = ledgerData.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = ledgerData.reduce((sum, t) => sum + t.credit, 0);
  const closingBalance = ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6 print:hidden">
          <div>
            <label className="block text-gray-700 mb-2">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.code}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={generateLedger}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Generate
            </button>
            {ledgerData.length > 0 && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {ledgerData.length > 0 && (
          <div id="printable">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 mb-2">Ledger Report</h2>
              <h3 className="text-gray-700">
                {selectedAccountData?.code} - {selectedAccountData?.name}
              </h3>
              <p className="text-gray-600">
                Period: {dateFrom || 'Beginning'} to {dateTo || 'Current'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700">Voucher No.</th>
                    <th className="px-4 py-3 text-left text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-gray-700">Debit</th>
                    <th className="px-4 py-3 text-right text-gray-700">Credit</th>
                    <th className="px-4 py-3 text-right text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ledgerData.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{transaction.date}</td>
                      <td className="px-4 py-3 text-gray-900">{transaction.voucherNo}</td>
                      <td className="px-4 py-3 text-gray-700">{transaction.description}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {transaction.debit > 0 ? `$${transaction.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {transaction.credit > 0 ? `$${transaction.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
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
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${closingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {ledgerData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Select an account and click "Generate" to view ledger report</p>
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
