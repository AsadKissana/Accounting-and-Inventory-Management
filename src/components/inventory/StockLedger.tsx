import { useState, useEffect } from 'react';
import { Printer, Filter } from 'lucide-react';

type StockTransaction = {
  date: string;
  type: 'GRN' | 'Sale' | 'Adjustment';
  referenceNo: string;
  in: number;
  out: number;
  balance: number;
};

export function StockLedger() {
  const [stock, setStock] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  useEffect(() => {
    const savedStock = localStorage.getItem('stock');
    if (savedStock) {
      setStock(JSON.parse(savedStock));
    }
  }, []);

  const generateLedger = () => {
    if (!selectedItem) return;

    const item = stock.find(s => s.itemCode === selectedItem);
    if (!item) return;

    const ledgerTransactions: StockTransaction[] = [];
    let balance = 0;

    // Add opening balance
    ledgerTransactions.push({
      date: dateFrom || '2024-01-01',
      type: 'Adjustment',
      referenceNo: 'Opening Balance',
      in: item.quantity,
      out: 0,
      balance: item.quantity,
    });
    balance = item.quantity;

    // Get GRN transactions
    const grns = JSON.parse(localStorage.getItem('grns') || '[]');
    grns.forEach((grn: any) => {
      if (dateFrom && grn.date < dateFrom) return;
      if (dateTo && grn.date > dateTo) return;

      grn.lines.forEach((line: any) => {
        if (line.itemCode === selectedItem && line.receivedQty > 0) {
          balance += line.receivedQty;
          ledgerTransactions.push({
            date: grn.date,
            type: 'GRN',
            referenceNo: grn.grnNo,
            in: line.receivedQty,
            out: 0,
            balance,
          });
        }
      });
    });

    // Get Sale transactions
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    sales.forEach((sale: any) => {
      if (dateFrom && sale.date < dateFrom) return;
      if (dateTo && sale.date > dateTo) return;

      sale.lines.forEach((line: any) => {
        if (line.itemCode === selectedItem) {
          balance -= line.quantity;
          ledgerTransactions.push({
            date: sale.date,
            type: 'Sale',
            referenceNo: sale.invoiceNo,
            in: 0,
            out: line.quantity,
            balance,
          });
        }
      });
    });

    // Sort by date
    ledgerTransactions.sort((a, b) => a.date.localeCompare(b.date));

    setTransactions(ledgerTransactions);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedItemData = stock.find(s => s.itemCode === selectedItem);
  const totalIn = transactions.reduce((sum, t) => sum + t.in, 0);
  const totalOut = transactions.reduce((sum, t) => sum + t.out, 0);
  const closingBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6 print:hidden">
          <div>
            <label className="block text-gray-700 mb-2">Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Item</option>
              {stock.map(item => (
                <option key={item.itemCode} value={item.itemCode}>
                  {item.itemCode} - {item.itemName}
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
            {transactions.length > 0 && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {transactions.length > 0 && (
          <div id="printable">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 mb-2">Stock Ledger</h2>
              <h3 className="text-gray-700">
                {selectedItemData?.itemCode} - {selectedItemData?.itemName}
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
                    <th className="px-4 py-3 text-left text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-gray-700">Reference No.</th>
                    <th className="px-4 py-3 text-right text-gray-700">In</th>
                    <th className="px-4 py-3 text-right text-gray-700">Out</th>
                    <th className="px-4 py-3 text-right text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{transaction.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          transaction.type === 'GRN' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'Sale' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{transaction.referenceNo}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {transaction.in > 0 ? transaction.in.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {transaction.out > 0 ? transaction.out.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {transaction.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {totalIn.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {totalOut.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {closingBalance.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Select an item and click "Generate" to view stock ledger</p>
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
