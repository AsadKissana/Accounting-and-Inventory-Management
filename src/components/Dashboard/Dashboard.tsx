import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  FileText,
  ArrowUpRight,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type StockItem = {
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  value: number;
};

type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  customer: string;
  total: number;
  lines: any[];
};

type PurchaseOrder = {
  id: string;
  poNo: string;
  date: string;
  supplier: string;
  total: number;
  status: string;
};

type Voucher = {
  id: string;
  voucherNo: string;
  date: string;
  type: string;
  lines: any[];
};

type Account = {
  id: string;
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
};

// Dummy data generators
const generateDummyStock = (): StockItem[] => {
  return [
    { itemCode: "MED-001", itemName: "Canine Multivitamins", quantity: 150, unitPrice: 25, value: 3750 },
    { itemCode: "MED-002", itemName: "Feline Deworming Tablets", quantity: 8, unitPrice: 15, value: 120 },
    { itemCode: "VAC-001", itemName: "Rabies Vaccine", quantity: 200, unitPrice: 45, value: 9000 },
    { itemCode: "VAC-002", itemName: "Canine Distemper Vaccine", quantity: 5, unitPrice: 50, value: 250 },
    { itemCode: "FOOD-001", itemName: "Premium Dog Food 5kg", quantity: 300, unitPrice: 35, value: 10500 },
    { itemCode: "FOOD-002", itemName: "Premium Cat Food 3kg", quantity: 180, unitPrice: 28, value: 5040 },
    { itemCode: "EQ-001", itemName: "Stethoscope", quantity: 25, unitPrice: 120, value: 3000 },
    { itemCode: "EQ-002", itemName: "Digital Thermometer", quantity: 40, unitPrice: 45, value: 1800 },
    { itemCode: "EQ-003", itemName: "Surgical Gloves (100pk)", quantity: 7, unitPrice: 22, value: 154 },
    { itemCode: "EQ-004", itemName: "Syringes (50pk)", quantity: 95, unitPrice: 18, value: 1710 },
    { itemCode: "CARE-001", itemName: "Pet Shampoo", quantity: 120, unitPrice: 12, value: 1440 },
    { itemCode: "CARE-002", itemName: "Dental Treats", quantity: 6, unitPrice: 8, value: 48 },
    { itemCode: "EQ-005", itemName: "Vaccination Cooler", quantity: 15, unitPrice: 250, value: 3750 },
    { itemCode: "MED-003", itemName: "IV Fluids", quantity: 85, unitPrice: 32, value: 2720 },
    { itemCode: "CARE-003", itemName: "Pet Bandages", quantity: 4, unitPrice: 6, value: 24 },
  ];
};

const generateDummySales = (): Invoice[] => {
  const customers = [
    "Pets Paradise Clinic - Karachi",
    "Animal Care Center - Lahore",
    "Vet Solutions - Islamabad",
    "Paws & Claws Veterinary - Rawalpindi",
    "Happy Pets Hospital - Faisalabad"
  ];

  const sales: Invoice[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(currentDate);
    date.setDate(date.getDate() - daysAgo);

    const numLines = Math.floor(Math.random() * 4) + 1;
    const lines = [];
    let total = 0;

    for (let j = 0; j < numLines; j++) {
      const items = [
        { name: "Canine Multivitamins", price: 25 },
        { name: "Rabies Vaccine", price: 45 },
        { name: "Premium Dog Food 5kg", price: 35 },
        { name: "Feline Deworming Tablets", price: 15 },
        { name: "Stethoscope", price: 120 },
      ];
      const item = items[Math.floor(Math.random() * items.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const amount = item.price * quantity;
      total += amount;

      lines.push({
        id: `line-${j}`,
        itemCode: `ITM-${j}`,
        itemName: item.name,
        description: "",
        quantity,
        unitPrice: item.price,
        amount
      });
    }

    sales.push({
      id: `inv-${i}`,
      invoiceNo: `INV-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      customer: customers[Math.floor(Math.random() * customers.length)],
      total,
      lines
    });
  }

  return sales;
};

const generateDummyPurchaseOrders = (): PurchaseOrder[] => {
  const suppliers = [
    "MediVet Supplies Ltd - China",
    "Global Pet Care - UK",
    "VetEquip International - USA",
    "Animal Health Solutions - Japan"
  ];

  const orders: PurchaseOrder[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 120);
    const date = new Date(currentDate);
    date.setDate(date.getDate() - daysAgo);

    const statuses = ['Pending', 'Approved', 'Received'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    orders.push({
      id: `po-${i}`,
      poNo: `PO-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      total: Math.floor(Math.random() * 50000) + 10000,
      status
    });
  }

  return orders;
};

const generateDummyVouchers = (): Voucher[] => {
  const vouchers: Voucher[] = [];
  const currentDate = new Date();
  const types = ['Journal', 'Payment', 'Receipt', 'Contra'];

  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(currentDate);
    date.setDate(date.getDate() - daysAgo);

    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 15000) + 1000;

    vouchers.push({
      id: `voucher-${i}`,
      voucherNo: `VCH-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      type,
      lines: [
        {
          id: `line-1`,
          accountCode: '1001',
          accountName: 'Cash',
          description: `${type} entry`,
          debit: type === 'Payment' ? 0 : amount,
          credit: type === 'Payment' ? amount : 0
        }
      ]
    });
  }

  return vouchers;
};

const generateDummyAccounts = (): Account[] => {
  return [
    { id: "1", code: "1001", name: "Cash in Hand", type: "Asset", balance: 125000 },
    { id: "2", code: "1002", name: "Bank Account - HBL", type: "Asset", balance: 350000 },
    { id: "3", code: "1100", name: "Accounts Receivable", type: "Asset", balance: 85000 },
    { id: "4", code: "1300", name: "Inventory - Medicines", type: "Asset", balance: 145000 },
    { id: "5", code: "2001", name: "Accounts Payable", type: "Liability", balance: -65000 },
    { id: "6", code: "2100", name: "Bank Loan", type: "Liability", balance: -200000 },
    { id: "7", code: "3001", name: "Owner Capital", type: "Equity", balance: -500000 },
    { id: "8", code: "4001", name: "Medicine Sales", type: "Revenue", balance: -285000 },
    { id: "9", code: "4002", name: "Vaccine Sales", type: "Revenue", balance: -195000 },
    { id: "10", code: "4003", name: "Pet Food Sales", type: "Revenue", balance: -165000 },
    { id: "11", code: "4004", name: "Equipment Sales", type: "Revenue", balance: -85000 },
    { id: "12", code: "5001", name: "Cost of Goods Sold", type: "Expense", balance: 285000 },
    { id: "13", code: "5100", name: "Salaries Expense", type: "Expense", balance: 125000 },
    { id: "14", code: "5200", name: "Rent Expense", type: "Expense", balance: 45000 },
    { id: "15", code: "5300", name: "Utilities Expense", type: "Expense", balance: 18000 },
    { id: "16", code: "5400", name: "Marketing Expense", type: "Expense", balance: 22000 },
    { id: "17", code: "5500", name: "Depreciation Expense", type: "Expense", balance: 15000 },
  ];
};

export function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    inventoryValue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockItems: 0,
    pendingPOs: 0,
  });

  const [revenueData, setRevenueData] = useState<any>(null);
  const [salesByCategoryData, setSalesByCategoryData] = useState<any>(null);
  const [topCustomersData, setTopCustomersData] = useState<any>(null);
  const [stockLevelsData, setStockLevelsData] = useState<any>(null);
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any>(null);
  const [cashFlowData, setCashFlowData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load all data from localStorage or use dummy data
    const stock: StockItem[] = JSON.parse(
      localStorage.getItem("stock") || JSON.stringify(generateDummyStock()),
    );
    const sales: Invoice[] = JSON.parse(
      localStorage.getItem("sales") || JSON.stringify(generateDummySales()),
    );
    const purchaseOrders: PurchaseOrder[] = JSON.parse(
      localStorage.getItem("purchaseOrders") || JSON.stringify(generateDummyPurchaseOrders()),
    );
    const vouchers: Voucher[] = JSON.parse(
      localStorage.getItem("vouchers") || JSON.stringify(generateDummyVouchers()),
    );
    const accounts: Account[] = JSON.parse(
      localStorage.getItem("chartOfAccounts") || JSON.stringify(generateDummyAccounts()),
    );

    // Calculate total inventory value
    const inventoryValue = stock.reduce((sum, item) => sum + item.value, 0);

    // Calculate total revenue from sales
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    // Calculate total expenses from vouchers
    const expenseAccounts = accounts.filter((acc) => acc.type === "Expense");
    const totalExpenses = Math.abs(
      expenseAccounts.reduce((sum, acc) => sum + acc.balance, 0),
    );

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;

    // Get unique customers
    const uniqueCustomers = new Set(sales.map((sale) => sale.customer)).size;

    // Count low stock items (quantity < 10)
    const lowStock = stock.filter((item) => item.quantity < 10);

    // Count pending purchase orders
    const pendingPOs = purchaseOrders.filter(
      (po) => po.status === "Pending",
    ).length;

    setStats({
      totalRevenue,
      totalExpenses,
      netProfit,
      inventoryValue,
      totalCustomers: uniqueCustomers,
      totalOrders: sales.length,
      lowStockItems: lowStock.length,
      pendingPOs,
    });

    // Generate revenue trend data (last 6 months)
    const revenueByMonth = generateMonthlyRevenueData(sales);
    setRevenueData(revenueByMonth);

    // Sales by category
    const categoryData = generateSalesByCategoryData(sales);
    setSalesByCategoryData(categoryData);

    // Top customers
    const topCustomers = generateTopCustomersData(sales);
    setTopCustomersData(topCustomers);

    // Stock levels for top items
    const topStockItems = generateStockLevelsData(stock);
    setStockLevelsData(topStockItems);

    // Low stock items
    setLowStockItems(lowStock.slice(0, 5));

    // Recent transactions from vouchers and sales
    const recent = generateRecentTransactions(sales, purchaseOrders, vouchers);
    setRecentTransactions(recent);

    // Expense breakdown
    const expBreakdown = generateExpenseBreakdown(accounts);
    setExpenseBreakdown(expBreakdown);

    // Cash flow data
    const cashFlow = generateCashFlowData(sales, purchaseOrders);
    setCashFlowData(cashFlow);
  };

  const generateMonthlyRevenueData = (sales: Invoice[]) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const labels = [];
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );

      const monthSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getFullYear() === date.getFullYear() &&
          saleDate.getMonth() === date.getMonth()
        );
      });

      const revenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);

      labels.push(monthNames[date.getMonth()]);
      data.push(Math.round(revenue));
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          fill: true,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  };

  const generateSalesByCategoryData = (sales: Invoice[]) => {
    const categories = {
      Medicines: 0,
      Vaccines: 0,
      "Pet Food": 0,
      Equipment: 0,
      Others: 0,
    };

    sales.forEach((sale) => {
      sale.lines?.forEach((line: any) => {
        const itemName = line.itemName?.toLowerCase() || "";
        if (itemName.includes("vaccine")) {
          categories["Vaccines"] += line.amount || 0;
        } else if (itemName.includes("food")) {
          categories["Pet Food"] += line.amount || 0;
        } else if (
          itemName.includes("vitamin") ||
          itemName.includes("tablet") ||
          itemName.includes("deworming")
        ) {
          categories["Medicines"] += line.amount || 0;
        } else if (
          itemName.includes("stethoscope") ||
          itemName.includes("thermometer") ||
          itemName.includes("glove") ||
          itemName.includes("syringe")
        ) {
          categories["Equipment"] += line.amount || 0;
        } else {
          categories["Others"] += line.amount || 0;
        }
      });
    });

    const labels = Object.keys(categories).filter(
      (key) => categories[key as keyof typeof categories] > 0,
    );
    const data = labels.map(
      (key) => categories[key as keyof typeof categories],
    );

    return {
      labels,
      datasets: [
        {
          label: "Sales by Category",
          data,
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(139, 92, 246, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
            "rgb(139, 92, 246)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateTopCustomersData = (sales: Invoice[]) => {
    const customerTotals: Record<string, number> = {};

    sales.forEach((sale) => {
      customerTotals[sale.customer] =
        (customerTotals[sale.customer] || 0) + sale.total;
    });

    const sorted = Object.entries(customerTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const labels = sorted.map(([name]) =>
      name.length > 25 ? name.substring(0, 25) + "..." : name,
    );
    const data = sorted.map(([, total]) => Math.round(total));

    return {
      labels,
      datasets: [
        {
          label: "Total Sales",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generateStockLevelsData = (stock: StockItem[]) => {
    const topItems = stock.sort((a, b) => b.value - a.value).slice(0, 10);

    const labels = topItems.map((item) => item.itemName.substring(0, 20));
    const data = topItems.map((item) => item.quantity);

    return {
      labels,
      datasets: [
        {
          label: "Quantity",
          data,
          backgroundColor: "rgba(139, 92, 246, 0.8)",
          borderColor: "rgb(139, 92, 246)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generateRecentTransactions = (
    sales: Invoice[],
    pos: PurchaseOrder[],
    vouchers: Voucher[],
  ) => {
    const transactions: any[] = [];

    // Add sales
    sales.forEach((sale) => {
      transactions.push({
        type: "Sale",
        description: `Invoice ${sale.invoiceNo} - ${sale.customer}`,
        date: sale.date,
        amount: sale.total,
        status: "positive",
      });
    });

    // Add purchase orders
    pos.forEach((po) => {
      transactions.push({
        type: "Purchase",
        description: `PO ${po.poNo} - ${po.supplier}`,
        date: po.date,
        amount: po.total,
        status: "negative",
      });
    });

    // Add vouchers
    vouchers.forEach((voucher) => {
      const total =
        voucher.lines?.reduce(
          (sum: number, line: any) => sum + (line.debit || 0),
          0,
        ) || 0;
      transactions.push({
        type: voucher.type,
        description: `${voucher.type} Voucher ${voucher.voucherNo}`,
        date: voucher.date,
        amount: total,
        status: voucher.type === "Receipt" ? "positive" : "negative",
      });
    });

    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  };

  const generateExpenseBreakdown = (accounts: Account[]) => {
    const expenseAccounts = accounts.filter(
      (acc) => acc.type === "Expense" && acc.balance !== 0,
    );

    const sorted = expenseAccounts
      .map((acc) => ({
        name:
          acc.name.length > 20 ? acc.name.substring(0, 20) + "..." : acc.name,
        value: Math.abs(Math.round(acc.balance)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const labels = sorted.map((item) => item.name);
    const data = sorted.map((item) => item.value);

    return {
      labels,
      datasets: [
        {
          label: "Expenses",
          data,
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateCashFlowData = (sales: Invoice[], pos: PurchaseOrder[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentDate = new Date();
    const labels = [];
    const inflowData = [];
    const outflowData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );

      const monthSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getFullYear() === date.getFullYear() &&
          saleDate.getMonth() === date.getMonth()
        );
      });

      const monthPOs = pos.filter((po) => {
        const poDate = new Date(po.date);
        return (
          poDate.getFullYear() === date.getFullYear() &&
          poDate.getMonth() === date.getMonth()
        );
      });

      const inflow = monthSales.reduce((sum, sale) => sum + sale.total, 0);
      const outflow = monthPOs.reduce((sum, po) => sum + po.total, 0);

      labels.push(monthNames[date.getMonth()]);
      inflowData.push(Math.round(inflow));
      outflowData.push(Math.round(outflow));
    }

    return {
      labels,
      datasets: [
        {
          label: "Inflow",
          data: inflowData,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 1,
        },
        {
          label: "Outflow",
          data: outflowData,
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
        },
      ],
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const horizontalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return formatCurrency(context.parsed.x);
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = formatCurrency(context.parsed);
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const stockChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Business Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Complete overview of your accounting, inventory, and sales
              performance
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>From {stats.totalOrders} orders</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Net Profit
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.netProfit)}
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span>
                    Profit Margin:{" "}
                    {stats.totalRevenue > 0
                      ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(
                          1,
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Inventory Value
                </CardTitle>
                <Package className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.inventoryValue)}
                </div>
                <div className="flex items-center text-xs text-orange-600 mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>{stats.lowStockItems} low stock items</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalExpenses)}
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span>{stats.pendingPOs} pending POs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend and Cash Flow */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {revenueData && (
                    <Line data={revenueData} options={chartOptions} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Inflow vs Outflow comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {cashFlowData && (
                    <Bar data={cashFlowData} options={chartOptions} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Category and Top Customers */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {salesByCategoryData && (
                    <Doughnut
                      data={salesByCategoryData}
                      options={pieChartOptions}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>
                  Customers by total purchase value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {topCustomersData && (
                    <Bar
                      data={topCustomersData}
                      options={horizontalChartOptions}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Levels and Expense Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Top Inventory Items</CardTitle>
                <CardDescription>
                  Stock levels by inventory value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {stockLevelsData && (
                    <Bar data={stockLevelsData} options={stockChartOptions} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Top expenses by account category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {expenseBreakdown && (
                    <Pie data={expenseBreakdown} options={pieChartOptions} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert and Recent Transactions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <CardTitle>Low Stock Alert</CardTitle>
                </div>
                <CardDescription>
                  Items requiring reorder (quantity &lt; 10)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.length > 0 ? (
                    lowStockItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.itemName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Code: {item.itemCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            {item.quantity}
                          </p>
                          <p className="text-xs text-gray-600">units left</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>All items are adequately stocked</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                transaction.status === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mt-1">
                            {transaction.description}
                          </p>
                        </div>
                        <div
                          className={`text-right font-bold ${
                            transaction.status === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.status === "positive" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Summary */}
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle>Quick Stats Summary</CardTitle>
              <CardDescription>
                Key business metrics at a glance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCustomers}
                  </p>
                  <p className="text-sm text-gray-600">Active Customers</p>
                </div>
                <div className="text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.lowStockItems}
                  </p>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                </div>
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingPOs}
                  </p>
                  <p className="text-sm text-gray-600">Pending POs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
