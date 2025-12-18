import { useState, useEffect } from 'react';
import { Save, Package } from 'lucide-react';

type GRNLine = {
  id: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  amount: number;
};

type GRN = {
  id: string;
  grnNo: string;
  date: string;
  poNo: string;
  supplier: string;
  receivedBy: string;
  lines: GRNLine[];
  total: number;
};

export function GRNEntry() {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [grns, setGrns] = useState<GRN[]>([]);
  const [selectedPO, setSelectedPO] = useState<string>('');
  const [formData, setFormData] = useState<Partial<GRN>>({
    grnNo: '',
    date: new Date().toISOString().split('T')[0],
    poNo: '',
    supplier: '',
    receivedBy: '',
    lines: [],
  });

  useEffect(() => {
    const savedPOs = localStorage.getItem('purchaseOrders');
    if (savedPOs) {
      setPurchaseOrders(JSON.parse(savedPOs));
    }

    const savedGRNs = localStorage.getItem('grns');
    if (savedGRNs) {
      setGrns(JSON.parse(savedGRNs));
    }
  }, []);

  const handlePOSelect = (poNo: string) => {
    const po = purchaseOrders.find(p => p.poNo === poNo);
    if (po) {
      setSelectedPO(poNo);
      const lines: GRNLine[] = po.lines.map((line: any) => ({
        id: line.id,
        itemCode: line.itemCode,
        itemName: line.itemName,
        orderedQty: line.quantity,
        receivedQty: 0,
        unitPrice: line.unitPrice,
        amount: 0,
      }));
      setFormData({
        ...formData,
        poNo: po.poNo,
        supplier: po.supplier,
        lines,
      });
    }
  };

  const updateLine = (id: string, receivedQty: number) => {
    const updatedLines = (formData.lines || []).map(line => {
      if (line.id === id) {
        const amount = receivedQty * line.unitPrice;
        return { ...line, receivedQty, amount };
      }
      return line;
    });
    setFormData({ ...formData, lines: updatedLines });
  };

  const handleSave = () => {
    if (!formData.grnNo || !formData.poNo || !formData.receivedBy) {
      alert('Please fill in all required fields');
      return;
    }

    const total = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

    const newGRN: GRN = {
      id: Date.now().toString(),
      grnNo: formData.grnNo!,
      date: formData.date!,
      poNo: formData.poNo!,
      supplier: formData.supplier!,
      receivedBy: formData.receivedBy!,
      lines: formData.lines!,
      total,
    };

    const updated = [...grns, newGRN];
    setGrns(updated);
    localStorage.setItem('grns', JSON.stringify(updated));

    // Update stock
    const existingStock = JSON.parse(localStorage.getItem('stock') || '[]');
    (formData.lines || []).forEach(line => {
      if (line.receivedQty > 0) {
        const stockItem = existingStock.find((s: any) => s.itemCode === line.itemCode);
        if (stockItem) {
          stockItem.quantity += line.receivedQty;
          stockItem.value += line.amount;
        } else {
          existingStock.push({
            itemCode: line.itemCode,
            itemName: line.itemName,
            quantity: line.receivedQty,
            unitPrice: line.unitPrice,
            value: line.amount,
          });
        }
      }
    });
    localStorage.setItem('stock', JSON.stringify(existingStock));

    setFormData({
      grnNo: '',
      date: new Date().toISOString().split('T')[0],
      poNo: '',
      supplier: '',
      receivedBy: '',
      lines: [],
    });
    setSelectedPO('');

    alert('GRN saved successfully and stock updated!');
  };

  const totalAmount = (formData.lines || []).reduce((sum, line) => sum + line.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">GRN Number</label>
            <input
              type="text"
              required
              value={formData.grnNo || ''}
              onChange={(e) => setFormData({ ...formData, grnNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GRN-001"
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
            <label className="block text-gray-700 mb-2">Purchase Order</label>
            <select
              value={selectedPO}
              onChange={(e) => handlePOSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select PO</option>
              {purchaseOrders.map(po => (
                <option key={po.id} value={po.poNo}>
                  {po.poNo} - {po.supplier}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Received By</label>
            <input
              type="text"
              required
              value={formData.receivedBy || ''}
              onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Name"
            />
          </div>
        </div>

        {formData.supplier && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              <strong>Supplier:</strong> {formData.supplier}
            </p>
          </div>
        )}

        {(formData.lines || []).length > 0 && (
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                  <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
                  <th className="px-4 py-3 text-right text-gray-700">Ordered Qty</th>
                  <th className="px-4 py-3 text-right text-gray-700">Received Qty</th>
                  <th className="px-4 py-3 text-right text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-right text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(formData.lines || []).map((line) => (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{line.itemCode}</td>
                    <td className="px-4 py-3 text-gray-900">{line.itemName}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{line.orderedQty}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max={line.orderedQty}
                        value={line.receivedQty || ''}
                        onChange={(e) => updateLine(line.id, parseFloat(e.target.value) || 0)}
                        className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${line.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {(formData.lines || []).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p>Select a Purchase Order to start receiving items</p>
          </div>
        )}

        {(formData.lines || []).length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save GRN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
