import { useState, useEffect } from 'react';
import { Printer, Filter, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Sale = {
  id: string;
  invoiceNo: string;
  date: string;
  customer: string;
  lines: any[];
  subtotal: number;
  tax: number;
  total: number;
};

export function SaleReport() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sales');
    if (saved) {
      const salesData = JSON.parse(saved);
      setSales(salesData);
      setFilteredSales(salesData);
    }
  }, []);

  const generateReport = () => {
    let filtered = sales;
    
    if (dateFrom) {
      filtered = filtered.filter(sale => sale.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(sale => sale.date <= dateTo);
    }
    
    setFilteredSales(filtered);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTax = filteredSales.reduce((sum, sale) => sum + sale.tax, 0);
  const totalSubtotal = filteredSales.reduce((sum, sale) => sum + sale.subtotal, 0);

  // Data for charts
  const salesByDate = filteredSales.reduce((acc: any, sale) => {
    const date = sale.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sale.total;
    return acc;
  }, {});

  const chartData = Object.entries(salesByDate).map(([date, total]) => ({
    date,
    total,
  })).slice(-10); // Last 10 entries

  const salesByCustomer = filteredSales.reduce((acc: any, sale) => {
    if (!acc[sale.customer]) {
      acc[sale.customer] = 0;
    }
    acc[sale.customer] += sale.total;
    return acc;
  }, {});

  const pieData = Object.entries(salesByCustomer).map(([customer, total]) => ({
    name: customer,
    value: total,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={generateReport}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                {showChart ? 'Table' : 'Charts'}
              </button>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Sales</p>
            <p className="text-blue-900">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">Subtotal</p>
            <p className="text-green-900">${totalSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600">Total Tax</p>
            <p className="text-purple-900">${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600">Invoices</p>
            <p className="text-orange-900">{filteredSales.length}</p>
          </div>
        </div>

        {showChart ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-gray-800 mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3B82F6" name="Sales Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {pieData.length > 0 && (
              <div>
                <h3 className="text-gray-800 mb-4">Sales by Customer</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div id="printable">
            <div className="text-center mb-6 hidden print:block">
              <h2 className="text-gray-900 mb-2">Sales Report</h2>
              <p className="text-gray-600">
                Period: {dateFrom || 'Beginning'} to {dateTo || 'Current'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Invoice No</th>
                    <th className="px-4 py-3 text-left text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-right text-gray-700">Subtotal</th>
                    <th className="px-4 py-3 text-right text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-right text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{sale.invoiceNo}</td>
                      <td className="px-4 py-3 text-gray-900">{sale.date}</td>
                      <td className="px-4 py-3 text-gray-900">{sale.customer}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${sale.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${sale.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${sale.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${totalSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {filteredSales.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No sales found for the selected period</p>
              </div>
            )}
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
