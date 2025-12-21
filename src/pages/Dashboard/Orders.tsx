import React, { useState } from 'react';
import { 
  Search, 
  Eye,
  Download,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import './Orders.css';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  date: string;
}

const demoOrders: Order[] = [
  { id: '#ORD-1234', customer: 'أحمد محمد علي', email: 'ahmed@email.com', phone: '0501234567', items: 2, total: 5998, status: 'delivered', paymentMethod: 'بطاقة ائتمان', date: '2024-01-15' },
  { id: '#ORD-1235', customer: 'سارة أحمد', email: 'sara@email.com', phone: '0551234567', items: 1, total: 8999, status: 'processing', paymentMethod: 'تحويل بنكي', date: '2024-01-15' },
  { id: '#ORD-1236', customer: 'محمد علي حسن', email: 'mohamed@email.com', phone: '0561234567', items: 3, total: 2997, status: 'shipped', paymentMethod: 'الدفع عند الاستلام', date: '2024-01-14' },
  { id: '#ORD-1237', customer: 'فاطمة حسن', email: 'fatima@email.com', phone: '0571234567', items: 1, total: 4299, status: 'pending', paymentMethod: 'بطاقة ائتمان', date: '2024-01-14' },
  { id: '#ORD-1238', customer: 'خالد عبدالله', email: 'khaled@email.com', phone: '0581234567', items: 2, total: 6398, status: 'delivered', paymentMethod: 'Apple Pay', date: '2024-01-13' },
  { id: '#ORD-1239', customer: 'نورة سعود', email: 'noura@email.com', phone: '0591234567', items: 1, total: 999, status: 'cancelled', paymentMethod: 'بطاقة ائتمان', date: '2024-01-13' },
];

const statusConfig = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
  processing: { label: 'قيد التجهيز', icon: Package, color: '#3b82f6', bg: '#dbeafe' },
  shipped: { label: 'تم الشحن', icon: Truck, color: '#8b5cf6', bg: '#ede9fe' },
  delivered: { label: 'تم التسليم', icon: CheckCircle, color: '#22c55e', bg: '#dcfce7' },
  cancelled: { label: 'ملغي', icon: XCircle, color: '#ef4444', bg: '#fee2e2' },
};

const Orders: React.FC = () => {
  const [orders] = useState<Order[]>(demoOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchQuery) || order.customer.includes(searchQuery);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="orders-page">
      {/* Stats */}
      <div className="orders-stats">
        <div className="stat-item">
          <div className="stat-icon pending">
            <Clock size={20} />
          </div>
          <div>
            <span className="stat-value">12</span>
            <span className="stat-label">قيد الانتظار</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon processing">
            <Package size={20} />
          </div>
          <div>
            <span className="stat-value">8</span>
            <span className="stat-label">قيد التجهيز</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon shipped">
            <Truck size={20} />
          </div>
          <div>
            <span className="stat-value">15</span>
            <span className="stat-label">تم الشحن</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon delivered">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="stat-value">234</span>
            <span className="stat-label">تم التسليم</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </select>
          <button className="btn btn-outline btn-sm">
            <Download size={16} />
            تصدير
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>المنتجات</th>
                <th>الإجمالي</th>
                <th>طريقة الدفع</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customer}</span>
                        <span className="customer-email">{order.email}</span>
                      </div>
                    </td>
                    <td>{order.items} منتج</td>
                    <td><strong>{formatPrice(order.total)} ر.س</strong></td>
                    <td>{order.paymentMethod}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ background: status.bg, color: status.color }}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={14} />
                        عرض
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">عرض 1-{filteredOrders.length} من {orders.length} طلب</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>السابق</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">التالي</button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تفاصيل الطلب {selectedOrder.id}</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h4>معلومات العميل</h4>
                  <div className="detail-row">
                    <span>الاسم:</span>
                    <strong>{selectedOrder.customer}</strong>
                  </div>
                  <div className="detail-row">
                    <span>البريد:</span>
                    <strong>{selectedOrder.email}</strong>
                  </div>
                  <div className="detail-row">
                    <span>الجوال:</span>
                    <strong>{selectedOrder.phone}</strong>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>معلومات الطلب</h4>
                  <div className="detail-row">
                    <span>عدد المنتجات:</span>
                    <strong>{selectedOrder.items}</strong>
                  </div>
                  <div className="detail-row">
                    <span>الإجمالي:</span>
                    <strong>{formatPrice(selectedOrder.total)} ر.س</strong>
                  </div>
                  <div className="detail-row">
                    <span>طريقة الدفع:</span>
                    <strong>{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div className="detail-row">
                    <span>التاريخ:</span>
                    <strong>{formatDate(selectedOrder.date)}</strong>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>تحديث الحالة</h4>
                  <select className="form-select">
                    {Object.entries(statusConfig).map(([key, value]) => (
                      <option key={key} value={key} selected={key === selectedOrder.status}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>
                إغلاق
              </button>
              <button className="btn btn-primary">
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
