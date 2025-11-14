import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_UPI_DETAILS } from '../data/mockData';
import { Order, Product, PaymentStatus, OrderStatus } from '../types';

type AdminView = 'dashboard' | 'products' | 'orders' | 'settings';

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

// --- Sub-components for Admin Page ---

const DashboardView: React.FC<{ orders: Order[] }> = ({ orders }) => {
    const totalSales = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered').length;
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Sales Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Total Sales</h3>
                    <p className="text-3xl font-bold mt-2">${totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{orders.length}</p>
                </div>
                 <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-gray-400 text-sm font-medium">Pending Orders</h3>
                    <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
                </div>
            </div>
        </div>
    );
};

const ProductsView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => {
    // In a real app, form handling would be more robust (e.g., using a library)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Product Management</h2>
            <div className="bg-gray-800/50 rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4">{product.name}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">${product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <button onClick={() => alert("Edit functionality to be implemented.")} className="text-blue-400 hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OrdersView: React.FC<{ orders: Order[], setOrders: (o: Order[]) => void }> = ({ orders, setOrders }) => {
    
    const updateOrderStatus = (id: string, status: OrderStatus) => {
        setOrders(orders.map(o => o.id === id ? {...o, orderStatus: status} : o));
    }

    const updatePaymentStatus = (id: string, status: PaymentStatus) => {
        setOrders(orders.map(o => o.id === id ? {...o, paymentStatus: status} : o));
    }

    const paymentStatusClasses: Record<PaymentStatus, string> = {
        'Awaiting Confirmation': 'bg-yellow-600/20 text-yellow-400',
        'Paid': 'bg-green-600/20 text-green-400',
        'Failed': 'bg-red-600/20 text-red-400'
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>
            <div className="bg-gray-800/50 rounded-lg overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Payment Status</th>
                            <th className="p-4">Order Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                            <tr key={order.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4 font-mono text-sm">{order.id}</td>
                                <td className="p-4">{order.customer.customerName}</td>
                                <td className="p-4">${order.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <select value={order.paymentStatus} onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)} className={`rounded-md p-1 bg-transparent border-0 focus:ring-0 ${paymentStatusClasses[order.paymentStatus]}`}>
                                        <option value="Awaiting Confirmation">Awaiting</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)} className="rounded-md p-1 bg-gray-700 border-gray-600">
                                        <option value="Processing">Processing</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsView: React.FC = () => {
    const [upiDetails, setUpiDetails] = useLocalStorage('renisUpiDetails', MOCK_UPI_DETAILS);
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // The useLocalStorage hook already saves on change, but this provides explicit save confirmation
        alert("Settings saved!");
    }
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">UPI QR Management</h2>
            <form onSubmit={handleSave} className="max-w-lg space-y-6">
                <div>
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">UPI ID</label>
                    <input type="text" name="upiId" value={upiDetails.upiId} onChange={(e) => setUpiDetails({...upiDetails, upiId: e.target.value})} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3" />
                </div>
                 <div>
                    <label htmlFor="qrCodeUrl" className="block text-sm font-medium text-gray-300">UPI QR Code Image URL</label>
                    <input type="text" name="qrCodeUrl" value={upiDetails.qrCodeUrl} onChange={(e) => setUpiDetails({...upiDetails, qrCodeUrl: e.target.value})} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3" />
                    <img src={upiDetails.qrCodeUrl} alt="QR Preview" className="mt-4 w-40 h-40 rounded-lg"/>
                </div>
                 <button type="submit" className="bg-white text-black px-6 py-2 rounded-md font-semibold">Save Settings</button>
            </form>
        </div>
    );
};


// --- Main Admin Page Component ---

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('renisAdminAuth', false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const [products, setProducts] = useLocalStorage<Product[]>('renisProducts', MOCK_PRODUCTS);
  const [orders, setOrders] = useLocalStorage<Order[]>('renisOrders', []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for this mock setup
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-b from-[#111111] to-black min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-black/50 rounded-lg shadow-2xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-center mb-1">Admin Login</h1>
          <h2 className="text-center text-gray-400 mb-6">Renis Store</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password-admin" className="sr-only">Password</label>
              <input 
                id="password-admin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-800 text-white rounded-md p-3 border border-gray-700 focus:ring-1 focus:ring-white"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-gray-200 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const NavItem: React.FC<{ view: AdminView, label: string }> = ({ view, label }) => (
     <button onClick={() => setActiveView(view)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === view ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
        {label}
    </button>
  );

  return (
    <div className="text-white min-h-screen flex">
      <aside className="w-64 bg-black/50 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">RENIS ADMIN</h1>
        <nav className="flex flex-col space-y-2">
            <NavItem view="dashboard" label="Dashboard" />
            <NavItem view="products" label="Products" />
            <NavItem view="orders" label="Orders" />
            <NavItem view="settings" label="Settings" />
        </nav>
        <div className="mt-auto">
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-10">
        {activeView === 'dashboard' && <DashboardView orders={orders}/>}
        {activeView === 'products' && <ProductsView products={products} setProducts={setProducts} />}
        {activeView === 'orders' && <OrdersView orders={orders} setOrders={setOrders} />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default AdminPage;