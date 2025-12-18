import { useState, useEffect } from 'react';
import { Printer, Eye } from 'lucide-react';

type PurchaseOrder = {
  id: string;
  poNo: string;
  date: string;
  supplier: string;
  deliveryDate: string;
  terms: string;
  lines: any[];
  total: number;
  status: string;
};

export function POPrinting() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('purchaseOrders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* PO List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-800 mb-4">Purchase Orders</h3>
          <div className="space-y-2">
            {orders.map(po => (
              <button
                key={po.id}
                onClick={() => setSelectedPO(po)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedPO?.id === po.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{po.poNo}</p>
                    <p className="text-sm text-gray-500">{po.supplier}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    po.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {po.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">${po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </button>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No purchase orders found</p>
            )}
          </div>
        </div>

        {/* PO Preview */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {selectedPO ? (
            <>
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h3 className="text-gray-800">Purchase Order Preview</h3>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>

              <div className="border border-gray-300 p-8 bg-white" id="printable">
                {/* company logo here */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/Logo-1.jpg"
                    alt="Company Logo"
                    className="mx-auto mb-4 items-center justify-center"
                    style={{ maxHeight: '80px' }}
                  />
                </div>                
                <div className="text-center mb-6">
                  <h2 className="text-gray-900 mb-2">Vet Line International</h2>
                  <h3 className="text-gray-800">Purchase Order</h3>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-gray-700 mb-2">Supplier:</h4>
                    <p className="text-gray-900">{selectedPO.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">PO No: <span className="text-gray-900">{selectedPO.poNo}</span></p>
                    <p className="text-gray-600">Date: <span className="text-gray-900">{selectedPO.date}</span></p>
                    <p className="text-gray-600">Delivery Date: <span className="text-gray-900">{selectedPO.deliveryDate}</span></p>
                    <p className="text-gray-600">Terms: <span className="text-gray-900">{selectedPO.terms}</span></p>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                      <th className="px-4 py-3 text-left text-gray-700">Description</th>
                      <th className="px-4 py-3 text-right text-gray-700">Qty</th>
                      <th className="px-4 py-3 text-right text-gray-700">Unit Price</th>
                      <th className="px-4 py-3 text-right text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPO.lines.map((line, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900">{line.itemCode}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <div>{line.itemName}</div>
                          {line.description && <div className="text-sm text-gray-500">{line.description}</div>}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">{line.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          ${line.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          ${line.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-gray-900">Total Amount</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${selectedPO.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="mt-8 pt-6 border-t border-gray-300">
                  <p className="text-gray-600 mb-4">Terms and Conditions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Payment terms: {selectedPO.terms}</li>
                    <li>• Delivery must be made by {selectedPO.deliveryDate}</li>
                    <li>• All items must meet quality specifications</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-gray-300">
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Authorized By</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Received By</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mb-4" />
              <p>Select a purchase order to preview</p>
            </div>
          )}
        </div>
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
