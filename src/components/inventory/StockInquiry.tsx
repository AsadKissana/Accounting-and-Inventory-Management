import { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';

type StockItem = {
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  value: number;
};

export function StockInquiry() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = () => {
    const saved = localStorage.getItem('stock');
    if (saved) {
      setStock(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleStock: StockItem[] = 
      [
    { "itemCode": "ITM-001", "itemName": "Canine Multivitamins", "quantity": 200, "unitPrice": 15, "value": 3000 },
    { "itemCode": "ITM-002", "itemName": "Feline Deworming Tablets", "quantity": 150, "unitPrice": 25, "value": 3750 },
    { "itemCode": "ITM-003", "itemName": "Rabies Vaccine", "quantity": 100, "unitPrice": 50, "value": 5000 },
    { "itemCode": "ITM-004", "itemName": "Canine Distemper Vaccine", "quantity": 120, "unitPrice": 45, "value": 5400 },
    { "itemCode": "ITM-005", "itemName": "Premium Dog Food - 5kg", "quantity": 80, "unitPrice": 60, "value": 4800 },
    { "itemCode": "ITM-006", "itemName": "Premium Cat Food - 3kg", "quantity": 90, "unitPrice": 55, "value": 4950 },
    { "itemCode": "ITM-007", "itemName": "Surgical Gloves Pack", "quantity": 300, "unitPrice": 5, "value": 1500 },
    { "itemCode": "ITM-008", "itemName": "Stethoscope", "quantity": 25, "unitPrice": 120, "value": 3000 },
    { "itemCode": "ITM-009", "itemName": "Digital Thermometer", "quantity": 40, "unitPrice": 35, "value": 1400 },
    { "itemCode": "ITM-010", "itemName": "Veterinary Syringes Pack", "quantity": 500, "unitPrice": 2, "value": 1000 },
    { "itemCode": "ITM-011", "itemName": "Pet Shampoo 500ml", "quantity": 150, "unitPrice": 10, "value": 1500 },
    { "itemCode": "ITM-012", "itemName": "Dental Care Treats for Dogs", "quantity": 100, "unitPrice": 20, "value": 2000 },
    { "itemCode": "ITM-013", "itemName": "Vaccination Cooler Box", "quantity": 15, "unitPrice": 250, "value": 3750 },
    { "itemCode": "ITM-014", "itemName": "IV Fluids 500ml", "quantity": 60, "unitPrice": 30, "value": 1800 },
    { "itemCode": "ITM-015", "itemName": "Pet Bandages Pack", "quantity": 200, "unitPrice": 8, "value": 1600 }
];
      setStock(sampleStock);
      localStorage.setItem('stock', JSON.stringify(sampleStock));
    }
  };

  const filteredStock = stock.filter(item =>
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuantity = filteredStock.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = filteredStock.reduce((sum, item) => sum + item.value, 0);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 20) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by item code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Items</p>
                <p className="text-blue-900">{filteredStock.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-green-600">Total Quantity</p>
              <p className="text-green-900">{totalQuantity.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-purple-600">Total Value</p>
              <p className="text-purple-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Item Code</th>
                <th className="px-4 py-3 text-left text-gray-700">Item Name</th>
                <th className="px-4 py-3 text-right text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-right text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-right text-gray-700">Total Value</th>
                <th className="px-4 py-3 text-center text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStock.map((item) => {
                const status = getStockStatus(item.quantity);
                return (
                  <tr key={item.itemCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{item.itemCode}</td>
                    <td className="px-4 py-3 text-gray-900">{item.itemName}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStock.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <p>No stock items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
