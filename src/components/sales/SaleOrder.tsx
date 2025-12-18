import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

type SaleLine = {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type SaleOrder = {
  id: string;
  orderNo: string;
  date: string;
  customer: string;
  deliveryDate: string;
  terms: string;
  lines: SaleLine[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered';
};

export function SaleOrder() {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [customers, setCustomers] = useState<string[]>([
  "Karachi Pet Distributors",
  "Lahore Vet Clinic",
  "Islamabad Animal Care Center",
  "Multan Pet Supplies",
  "Faisalabad Veterinary Services",
  "Rawalpindi Pet Clinic",
  "Peshawar Animal Health Store",
  "Quetta Pet Care Solutions",
  "Hyderabad Vet Supplies",
  "Sialkot Pet Shop",
  "Gujranwala Veterinary Clinic",
  "Bahawalpur Pet Distributors",
  "Sukkur Animal Health Center",
  "Mardan Vet Clinic",
  "Abbottabad Pet Supplies",
  "Larkana Animal Care Store",
  "Sheikhupura Veterinary Services",
  "Okara Pet Clinic",
  "Jhang Pet Supplies",
  "Chiniot Veterinary Center",
  "Dera Ghazi Khan Pet Shop",
  "Muzaffargarh Vet Clinic",
  "Rahim Yar Khan Animal Care",
  "Mingora Pet Supplies",
  "Gujrat Veterinary Clinic",
  "Sahiwal Pet Distributors",
  "Kohat Animal Health Store",
  "Bannu Vet Clinic",
  "Jacobabad Pet Supplies",
  "Nawabshah Veterinary Services"
]
);
  const [formData, setFormData] = useState<Partial<SaleOrder>>({
    orderNo: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    deliveryDate: '',
    terms: 'Net 30',
    lines: [],
    status: 'Pending',
  });

  useEffect(() => {
    const saved = localStorage.getItem('saleOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }

    const savedStock = localStorage.getItem('stock');
    if (savedStock) {
      setStock(JSON.parse(savedStock));
    }
  }, []);

  const addLine = () => {
    const newLine: SaleLine = {
      id: Date.now().toString(),
      itemCode: '',
      itemName: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
    };
    setFormData({
      ...formData,
      lines: [...(formData.lines || []), newLine],
    });
  };

  const updateLine = (id: string, field: keyof SaleLine, value: any) => {
    const updatedLines = (formData.lines || []).map(line => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
        
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
    setFormData({ ...formData, lines: updatedLines });
  };

  const removeLine = (id: string) => {
    setFormData({
      ...formData,
      lines: (formData.lines || []).filter(line => line.id !== id),
    });
  };

  const handleSave = () => {
    if (!formData.orderNo || !formData.customer || !formData.lines?.length) {
      alert('Please fill in all required fields');
      return;
    }

    const total = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

    const newOrder: SaleOrder = {
      id: Date.now().toString(),
      orderNo: formData.orderNo!,
      date: formData.date!,
      customer: formData.customer!,
      deliveryDate: formData.deliveryDate!,
      terms: formData.terms || 'Net 30',
      lines: formData.lines,
      total,
      status: 'Pending',
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem('saleOrders', JSON.stringify(updated));

    setFormData({
      orderNo: '',
      date: new Date().toISOString().split('T')[0],
      customer: '',
      deliveryDate: '',
      terms: 'Net 30',
      lines: [],
      status: 'Pending',
    });

    alert('Sale Order saved successfully!');
  };

  const totalAmount = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Order Number</label>
            <input
              type="text"
              required
              value={formData.orderNo || ''}
              onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SO-001"
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
            <label className="block text-gray-700 mb-2">Customer</label>
            <select
              value={formData.customer || ''}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Delivery Date</label>
            <input
              type="date"
              value={formData.deliveryDate || ''}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Payment Terms</label>
            <select
              value={formData.terms || 'Net 30'}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Advance">Advance Payment</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={addLine}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
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
                        <option key={item.itemCode} value={item.itemCode}>
                          {item.itemCode} - {item.itemName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={line.quantity || ''}
                      onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
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
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeLine(line.id)}
                      className="mx-auto block p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-gray-900">Total Amount</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Sale Order
          </button>
        </div>
      </div>
    </div>
  );
}
