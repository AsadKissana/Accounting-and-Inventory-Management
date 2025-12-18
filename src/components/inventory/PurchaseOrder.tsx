import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

type POLine = {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type PurchaseOrder = {
  id: string;
  poNo: string;
  date: string;
  supplier: string;
  deliveryDate: string;
  terms: string;
  lines: POLine[];
  total: number;
  status: 'Pending' | 'Approved' | 'Received';
};

export function PurchaseOrder() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([
  "Shanghai Vet Supplies Co. Ltd.",      // China
  "Beijing Animal Health Products",      // China
  "London Vet Pharma Ltd.",              // UK
  "UK Pet Nutrition Supplies",           // UK
  "USA Veterinary Solutions Inc.",       // USA
  "American Pet Care Supplies",          // USA
  "Tokyo Animal Health Co.",             // Japan
  "Osaka Vet Equipment Ltd.",            // Japan
  "Sydney Vet Supplies Pty Ltd.",        // Australia
  "Melbourne Pet Health Products"        // Australia
]);
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    poNo: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    deliveryDate: '',
    terms: 'Net 30',
    lines: [],
    status: 'Pending',
  });

  useEffect(() => {
    const saved = localStorage.getItem('purchaseOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const addLine = () => {
    const newLine: POLine = {
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

  const updateLine = (id: string, field: keyof POLine, value: any) => {
    const updatedLines = (formData.lines || []).map(line => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
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
    if (!formData.poNo || !formData.supplier || !formData.lines?.length) {
      alert('Please fill in all required fields');
      return;
    }

    const total = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      poNo: formData.poNo!,
      date: formData.date!,
      supplier: formData.supplier!,
      deliveryDate: formData.deliveryDate!,
      terms: formData.terms || 'Net 30',
      lines: formData.lines,
      total,
      status: 'Pending',
    };

    const updated = [...orders, newPO];
    setOrders(updated);
    localStorage.setItem('purchaseOrders', JSON.stringify(updated));

    setFormData({
      poNo: '',
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      deliveryDate: '',
      terms: 'Net 30',
      lines: [],
      status: 'Pending',
    });

    alert('Purchase Order saved successfully!');
  };

  const totalAmount = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">PO Number</label>
            <input
              type="text"
              required
              value={formData.poNo || ''}
              onChange={(e) => setFormData({ ...formData, poNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="PO-001"
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
            <label className="block text-gray-700 mb-2">Supplier</label>
            <select
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
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
              <option value="Net 90">Net 90</option>
              <option value="COD">Cash on Delivery</option>
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
                <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
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
                    <input
                      type="text"
                      value={line.itemCode}
                      onChange={(e) => updateLine(line.id, 'itemCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ITM-001"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={line.itemName}
                      onChange={(e) => updateLine(line.id, 'itemName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Item Name"
                    />
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
                <td colSpan={5} className="px-4 py-3 text-right text-gray-900">Total Amount</td>
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
            Save Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}
