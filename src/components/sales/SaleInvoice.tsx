import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Printer } from 'lucide-react';

type SaleOrderLine = {
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type SaleOrder = {
  id: string;
  orderNo: string;
  customer: string;
  date: string;
  lines: SaleOrderLine[];
};

type InvoiceLine = SaleOrderLine & { id: string; amount: number };
type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  customer: string;
  lines: InvoiceLine[];
  subtotal: number;
  tax: number;
  total: number;
};

export function SaleInvoice() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [customers, setCustomers] = useState<string[]>(['Customer A', 'Customer B', 'Customer C', 'Walk-in Customer']);
  const [saleOrders, setSaleOrders] = useState<SaleOrder[]>([]);
  const [taxRate, setTaxRate] = useState(10);
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    lines: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [showPreview, setShowPreview] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedInvoices = localStorage.getItem('sales');
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

    const savedStock = localStorage.getItem('stock');
    if (savedStock) setStock(JSON.parse(savedStock));

    const savedOrders = localStorage.getItem('saleOrders');
    if (savedOrders) setSaleOrders(JSON.parse(savedOrders));
  }, []);

  // Populate invoice lines from selected Sale Order
  const handleSaleOrderSelect = (orderId: string) => {
    const order = saleOrders.find(o => o.id === orderId);
    if (order) {
      const invoiceLines: InvoiceLine[] = order.lines.map(line => ({
        ...line,
        id: Date.now().toString() + Math.random(), // unique id for invoice
        amount: line.quantity * line.unitPrice,
      }));

      const subtotal = invoiceLines.reduce((sum, line) => sum + line.amount, 0);
      const tax = (subtotal * taxRate) / 100;
      const total = subtotal + tax;

      setFormData({
        ...formData,
        customer: order.customer,
        lines: invoiceLines,
        subtotal,
        tax,
        total,
      });
    }
  };

  const addLine = () => {
    const newLine: InvoiceLine = {
      id: Date.now().toString(),
      itemCode: '',
      itemName: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
    };
    setFormData({ ...formData, lines: [...(formData.lines || []), newLine] });
  };

  const updateLine = (id: string, field: keyof InvoiceLine, value: any) => {
    const updatedLines = (formData.lines || []).map(line => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };

        // Auto-fill name & price from stock
        if (field === 'itemCode') {
          const stockItem = stock.find(s => s.itemCode === value);
          if (stockItem) {
            updated.itemName = stockItem.itemName;
            updated.unitPrice = stockItem.unitPrice;
          }
        }

        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = updated.quantity * updated.unitPrice;
        }

        return updated;
      }
      return line;
    });

    const subtotal = updatedLines.reduce((sum, line) => sum + line.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    setFormData({ ...formData, lines: updatedLines, subtotal, tax, total });
  };

  const removeLine = (id: string) => {
    const updatedLines = (formData.lines || []).filter(line => line.id !== id);
    const subtotal = updatedLines.reduce((sum, line) => sum + line.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    setFormData({ ...formData, lines: updatedLines, subtotal, tax, total });
  };

  const handleSave = () => {
    if (!formData.invoiceNo || !formData.customer || !formData.lines?.length) {
      alert('Please fill in all required fields');
      return;
    }

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNo: formData.invoiceNo!,
      date: formData.date!,
      customer: formData.customer!,
      lines: formData.lines!,
      subtotal: formData.subtotal!,
      tax: formData.tax!,
      total: formData.total!,
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('sales', JSON.stringify(updatedInvoices));

    // Update stock quantities
    const existingStock = JSON.parse(localStorage.getItem('stock') || '[]');
    (formData.lines || []).forEach(line => {
      const stockItem = existingStock.find((s: any) => s.itemCode === line.itemCode);
      if (stockItem) {
        stockItem.quantity -= line.quantity;
        stockItem.value = stockItem.quantity * stockItem.unitPrice;
      }
    });
    localStorage.setItem('stock', JSON.stringify(existingStock));

    setShowPreview(true);
  };

  const handlePrint = () => window.print();
  const handleNew = () => {
    setFormData({
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      customer: '',
      lines: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
    setShowPreview(false);
  };

  // ----- RENDER -----
  if (showPreview && formData.invoiceNo) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Invoice preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h3 className="text-gray-800">Invoice Preview</h3>
            <div className="flex gap-2">
              <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Printer className="w-5 h-5" /> Print
              </button>
              <button onClick={handleNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                New Invoice
              </button>
            </div>
          </div>

          <div className="border border-gray-300 p-8 bg-white" id="printable">
            <div className="text-left mb-6">
                  <img
                    src="/Logo-1.jpg"
                    alt="Company Logo"
                    className="mx-auto mb-4 items-center justify-center"
                    style={{ maxHeight: '80px' }}
                  />
                </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div>
                  <h2 className="text-gray-900 text-2xl font-bold">Vet Line International</h2>
                  <p className="text-gray-600">LDA Avenue, Lahore</p>
                  <p className="text-gray-600">Phone: +1 234 567 890</p>
                </div>
              </div>
              <h3 className="text-gray-800 text-xl font-semibold">INVOICE</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-gray-700 mb-2">Bill To:</h4>
                <p className="text-gray-900">{formData.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Invoice No: <span className="text-gray-900">{formData.invoiceNo}</span></p>
                <p className="text-gray-600">Date: <span className="text-gray-900">{formData.date}</span></p>
              </div>
            </div>

            {/* Invoice lines table */}
            <table className="w-full mb-6">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Item</th>
                  <th className="px-4 py-3 text-left text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-right text-gray-700">Price</th>
                  <th className="px-4 py-3 text-right text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(formData.lines || []).map((line) => (
                  <tr key={line.id}>
                    <td className="px-4 py-3 text-gray-900">{line.itemCode} - {line.itemName}</td>
                    <td className="px-4 py-3 text-gray-700">{line.description}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{line.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-900">${line.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right text-gray-900">${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900">${formData.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Tax ({taxRate}%):</span>
                  <span className="text-gray-900">${formData.tax?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${formData.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600">
              Thank you for your business!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Sale order select */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Sale Order</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleSaleOrderSelect(e.target.value)}
            >
              <option value="">Select Sale Order</option>
              {saleOrders.map(order => (
                <option key={order.id} value={order.id}>{order.orderNo} - {order.customer}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNo || ''}
              onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value) || 0;
                setTaxRate(rate);
                const subtotal = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);
                const tax = (subtotal * rate) / 100;
                setFormData({ ...formData, tax, total: subtotal + tax });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Invoice lines */}
        <div className="mb-4">
          <button onClick={addLine} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" /> Add Item
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Item</th>
                <th className="px-4 py-3 text-left text-gray-700">Description</th>
                <th className="px-4 py-3 text-right text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-right text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-right text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(formData.lines || []).map((line) => (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <select
                      value={line.itemCode}
                      onChange={(e) => updateLine(line.id, 'itemCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Item</option>
                      {stock.map(item => (
                        <option key={item.itemCode} value={item.itemCode}>{item.itemCode} - {item.itemName}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={line.quantity || ''}
                      onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice || ''}
                      onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeLine(line.id)} className="mx-auto block p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Save */}
        <div className="flex justify-between items-end">
          <div className="space-y-2 text-right">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-gray-900">${formData.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax ({taxRate}%):</span>
              <span className="text-gray-900">${formData.tax?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">${formData.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Save className="w-5 h-5" /> Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
};