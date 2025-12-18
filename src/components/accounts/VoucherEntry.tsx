import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

type VoucherLine = {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
};

type Voucher = {
  id: string;
  voucherNo: string;
  date: string;
  type: 'Journal' | 'Payment' | 'Receipt' | 'Contra';
  reference: string;
  lines: VoucherLine[];
};

export function VoucherEntry() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [formData, setFormData] = useState<Partial<Voucher>>({
    voucherNo: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Journal',
    reference: '',
    lines: [],
  });

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

  const addLine = () => {
    const newLine: VoucherLine = {
      id: Date.now().toString(),
      accountCode: '',
      accountName: '',
      description: '',
      debit: 0,
      credit: 0,
    };
    setFormData({
      ...formData,
      lines: [...(formData.lines || []), newLine],
    });
  };

  const updateLine = (id: string, field: keyof VoucherLine, value: any) => {
    const updatedLines = (formData.lines || []).map(line => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
        if (field === 'accountCode') {
          const account = accounts.find(a => a.code === value);
          updated.accountName = account?.name || '';
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
    if (!formData.voucherNo || !formData.lines?.length) {
      alert('Please fill in all required fields');
      return;
    }

    const totalDebit = formData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Debit and Credit totals must be equal');
      return;
    }

    const newVoucher: Voucher = {
      id: Date.now().toString(),
      voucherNo: formData.voucherNo!,
      date: formData.date!,
      type: formData.type!,
      reference: formData.reference || '',
      lines: formData.lines,
    };

    const updated = [...vouchers, newVoucher];
    setVouchers(updated);
    localStorage.setItem('vouchers', JSON.stringify(updated));

    setFormData({
      voucherNo: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Journal',
      reference: '',
      lines: [],
    });

    alert('Voucher saved successfully!');
  };

  const totalDebit = (formData.lines || []).reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = (formData.lines || []).reduce((sum, line) => sum + line.credit, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Voucher No.</label>
            <input
              type="text"
              required
              value={formData.voucherNo || ''}
              onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="V-001"
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
            <label className="block text-gray-700 mb-2">Voucher Type</label>
            <select
              value={formData.type || 'Journal'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Voucher['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Journal">Journal Voucher</option>
              <option value="Payment">Payment Voucher</option>
              <option value="Receipt">Receipt Voucher</option>
              <option value="Contra">Contra Voucher</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Reference</label>
            <input
              type="text"
              value={formData.reference || ''}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reference No."
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={addLine}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Line
          </button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Account</th>
                <th className="px-4 py-3 text-left text-gray-700">Description</th>
                <th className="px-4 py-3 text-right text-gray-700">Debit</th>
                <th className="px-4 py-3 text-right text-gray-700">Credit</th>
                <th className="px-4 py-3 text-center text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(formData.lines || []).map((line) => (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <select
                      value={line.accountCode}
                      onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.code}>
                          {account.code} - {account.name}
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
                      step="0.01"
                      value={line.debit || ''}
                      onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.credit || ''}
                      onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                      className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
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
                <td colSpan={2} className="px-4 py-3 text-gray-900">Total</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {Math.abs(totalDebit - totalCredit) > 0.01 && (formData.lines || []).length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Warning:</strong> Debit and Credit must be equal. Difference: $
              {Math.abs(totalDebit - totalCredit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
