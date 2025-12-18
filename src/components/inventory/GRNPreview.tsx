import { useState, useEffect } from 'react';
import { Printer, Eye } from 'lucide-react';

type GRN = {
  id: string;
  grnNo: string;
  date: string;
  poNo: string;
  supplier: string;
  receivedBy: string;
  lines: any[];
  total: number;
};

export function GRNPreview() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('grns');
    if (saved) {
      setGrns(JSON.parse(saved));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* GRN List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-800 mb-4">Goods Received Notes</h3>
          <div className="space-y-2">
            {grns.map(grn => (
              <button
                key={grn.id}
                onClick={() => setSelectedGRN(grn)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedGRN?.id === grn.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{grn.grnNo}</p>
                    <p className="text-sm text-gray-500">{grn.supplier}</p>
                  </div>
                  <p className="text-sm text-gray-500">{grn.date}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">PO: {grn.poNo}</p>
              </button>
            ))}
            {grns.length === 0 && (
              <p className="text-gray-500 text-center py-4">No GRNs found</p>
            )}
          </div>
        </div>

        {/* GRN Preview */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {selectedGRN ? (
            <>
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h3 className="text-gray-800">GRN Preview</h3>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
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
                <div className="text-center mb-6">
                  <h2 className="text-gray-900 mb-2">Vet Line International</h2>
                  <h3 className="text-gray-800">Goods Received Note</h3>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-gray-700 mb-2">Supplier:</h4>
                    <p className="text-gray-900">{selectedGRN.supplier}</p>
                    <p className="text-gray-600 mt-2">Received By: <span className="text-gray-900">{selectedGRN.receivedBy}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">GRN No: <span className="text-gray-900">{selectedGRN.grnNo}</span></p>
                    <p className="text-gray-600">Date: <span className="text-gray-900">{selectedGRN.date}</span></p>
                    <p className="text-gray-600">PO No: <span className="text-gray-900">{selectedGRN.poNo}</span></p>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                      <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
                      <th className="px-4 py-3 text-right text-gray-700">Ordered</th>
                      <th className="px-4 py-3 text-right text-gray-700">Received</th>
                      <th className="px-4 py-3 text-right text-gray-700">Unit Price</th>
                      <th className="px-4 py-3 text-right text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedGRN.lines.map((line, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900">{line.itemCode}</td>
                        <td className="px-4 py-3 text-gray-900">{line.itemName}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{line.orderedQty}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{line.receivedQty}</td>
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
                      <td colSpan={5} className="px-4 py-3 text-right text-gray-900">Total Amount</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${selectedGRN.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="grid grid-cols-3 gap-8 mt-12 pt-6 border-t border-gray-300">
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Received By</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Checked By</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Approved By</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mb-4" />
              <p>Select a GRN to preview</p>
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
