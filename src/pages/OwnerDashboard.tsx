
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Redirect to login if not authenticated as owner
  React.useEffect(() => {
    if (!user?.isOwner) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Placeholder data - would connect to a real database in production
  const products = [
    { id: 1, name: 'زيت زيتون فلسطيني', category: 'زيوت', price: 120, stock: 25 },
    { id: 2, name: 'زعتر بلدي', category: 'بهارات', price: 30, stock: 50 },
    { id: 3, name: 'عسل طبيعي', category: 'العسل', price: 80, stock: 15 },
    { id: 4, name: 'جبنة نابلسية', category: 'الأجبان', price: 45, stock: 20 },
  ];

  const orders = [
    { id: 1, customer: 'محمد أحمد', date: '2025-05-10', status: 'completed', total: 240 },
    { id: 2, customer: 'سارة خالد', date: '2025-05-09', status: 'pending', total: 175 },
    { id: 3, customer: 'أحمد محمود', date: '2025-05-08', status: 'processing', total: 320 },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">{t('ownerDashboard')}</h1>
          <p className="text-sm text-muted-foreground">{t('welcomeOwner')}</p>
        </div>
        
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeTab === 'products' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab('products')}
              >
                <Package className="mr-2 h-4 w-4" />
                {t('products')}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'orders' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab('orders')}
              >
                <Users className="mr-2 h-4 w-4" />
                {t('orders')}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'analytics' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {t('analytics')}
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'settings' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t('settings')}
              </Button>
            </li>
            <li className="pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </Button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === 'products' && t('manageProducts')}
              {activeTab === 'orders' && t('manageOrders')}
              {activeTab === 'analytics' && t('viewAnalytics')}
              {activeTab === 'settings' && t('systemSettings')}
            </h2>
            
            {activeTab === 'products' && (
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  {t('addProduct')}
                </Button>
              </div>
            )}
          </div>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('search')} className="pl-9" />
          </div>
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">{t('productName')}</th>
                    <th className="p-3 text-left">{t('category')}</th>
                    <th className="p-3 text-left">{t('price')}</th>
                    <th className="p-3 text-left">{t('stock')}</th>
                    <th className="p-3 text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3">₪{product.price.toFixed(2)}</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            {t('edit')}
                          </Button>
                          <Button variant="destructive" size="sm">
                            {t('delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">{t('orderNumber')}</th>
                    <th className="p-3 text-left">{t('customerName')}</th>
                    <th className="p-3 text-left">{t('orderDate')}</th>
                    <th className="p-3 text-left">{t('status')}</th>
                    <th className="p-3 text-left">{t('total')}</th>
                    <th className="p-3 text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t">
                      <td className="p-3">#{order.id}</td>
                      <td className="p-3">{order.customer}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {order.status === 'completed' ? t('completed') : 
                           order.status === 'processing' ? t('processing') : 
                           t('pending')}
                        </span>
                      </td>
                      <td className="p-3">₪{order.total.toFixed(2)}</td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          {t('viewDetails')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Analytics Tab - Placeholder */}
          {activeTab === 'analytics' && (
            <div className="text-center py-12 text-muted-foreground">
              {t('analyticsComingSoon')}
            </div>
          )}
          
          {/* Settings Tab - Placeholder */}
          {activeTab === 'settings' && (
            <div className="text-center py-12 text-muted-foreground">
              {t('settingsComingSoon')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
