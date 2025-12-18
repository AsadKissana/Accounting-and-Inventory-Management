import { useState, useEffect } from 'react';
import { Printer, Eye } from 'lucide-react';

type Voucher = {
  id: string;
  voucherNo: string;
  date: string;
  type: string;
  reference: string;
  lines: any[];
};

export function VoucherPreview() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vouchers');
    if (saved) {
      setVouchers(JSON.parse(saved));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const totalDebit = selectedVoucher?.lines.reduce((sum, line) => sum + line.debit, 0) || 0;
  const totalCredit = selectedVoucher?.lines.reduce((sum, line) => sum + line.credit, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* Voucher List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-800 mb-4">Vouchers</h3>
          <div className="space-y-2">
            {vouchers.map(voucher => (
              <button
                key={voucher.id}
                onClick={() => setSelectedVoucher(voucher)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedVoucher?.id === voucher.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900">{voucher.voucherNo}</p>
                    <p className="text-sm text-gray-500">{voucher.type}</p>
                  </div>
                  <p className="text-sm text-gray-500">{voucher.date}</p>
                </div>
              </button>
            ))}
            {vouchers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No vouchers found</p>
            )}
          </div>
        </div>

        {/* Voucher Preview */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {selectedVoucher ? (
            <>
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h3 className="text-gray-800">Voucher Preview</h3>
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
                  <h3 className="text-gray-800">{selectedVoucher.type}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">Voucher No: <span className="text-gray-900">{selectedVoucher.voucherNo}</span></p>
                    <p className="text-gray-600">Reference: <span className="text-gray-900">{selectedVoucher.reference || 'N/A'}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Date: <span className="text-gray-900">{selectedVoucher.date}</span></p>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Account</th>
                      <th className="px-4 py-3 text-left text-gray-700">Description</th>
                      <th className="px-4 py-3 text-right text-gray-700">Debit</th>
                      <th className="px-4 py-3 text-right text-gray-700">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedVoucher.lines.map((line, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900">
                          {line.accountCode} - {line.accountName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{line.description}</td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {line.debit > 0 ? `$${line.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          {line.credit > 0 ? `$${line.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-gray-900">Total</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="grid grid-cols-3 gap-8 mt-12 pt-6 border-t border-gray-300">
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Prepared By</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-gray-600">Verified By</p>
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
              <p>Select a voucher to preview</p>
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
