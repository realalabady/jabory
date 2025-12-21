import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import './Categories.css';

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  productsCount: number;
  subcategories: { id: string; name: string; productsCount: number }[];
}

const demoCategories: Category[] = [
  {
    id: '1',
    name: 'الجوالات والأجهزة الذكية',
    nameEn: 'Phones & Smart Devices',
    icon: '📱',
    productsCount: 156,
    subcategories: [
      { id: '1-1', name: 'آيفون', productsCount: 45 },
      { id: '1-2', name: 'سامسونج', productsCount: 38 },
      { id: '1-3', name: 'هواوي', productsCount: 25 },
      { id: '1-4', name: 'شاومي', productsCount: 28 },
    ]
  },
  {
    id: '2',
    name: 'اللابتوبات والكمبيوتر',
    nameEn: 'Laptops & Computers',
    icon: '💻',
    productsCount: 89,
    subcategories: [
      { id: '2-1', name: 'ماك بوك', productsCount: 22 },
      { id: '2-2', name: 'ديل', productsCount: 18 },
      { id: '2-3', name: 'لينوفو', productsCount: 24 },
      { id: '2-4', name: 'HP', productsCount: 25 },
    ]
  },
  {
    id: '3',
    name: 'التلفزيونات والشاشات',
    nameEn: 'TVs & Displays',
    icon: '📺',
    productsCount: 67,
    subcategories: [
      { id: '3-1', name: 'سامسونج', productsCount: 28 },
      { id: '3-2', name: 'LG', productsCount: 22 },
      { id: '3-3', name: 'سوني', productsCount: 17 },
    ]
  },
  {
    id: '4',
    name: 'الألعاب والقيمنق',
    nameEn: 'Gaming',
    icon: '🎮',
    productsCount: 124,
    subcategories: [
      { id: '4-1', name: 'بلايستيشن', productsCount: 45 },
      { id: '4-2', name: 'إكس بوكس', productsCount: 32 },
      { id: '4-3', name: 'نينتندو', productsCount: 28 },
      { id: '4-4', name: 'ملحقات الألعاب', productsCount: 19 },
    ]
  },
  {
    id: '5',
    name: 'السماعات والصوتيات',
    nameEn: 'Audio',
    icon: '🎧',
    productsCount: 98,
    subcategories: [
      { id: '5-1', name: 'سماعات رأس', productsCount: 42 },
      { id: '5-2', name: 'سماعات لاسلكية', productsCount: 35 },
      { id: '5-3', name: 'مكبرات صوت', productsCount: 21 },
    ]
  },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [expandedIds, setExpandedIds] = useState<string[]>(['1']);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    icon: '',
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', nameEn: '', icon: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productsCount: 0,
        subcategories: []
      };
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="categories-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            إضافة تصنيف
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="categories-card">
        <div className="categories-list">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-main" onClick={() => toggleExpand(category.id)}>
                <div className="category-drag">
                  <GripVertical size={18} />
                </div>
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.productsCount} منتج</span>
                </div>
                <div className="category-actions">
                  <button className="action-btn" onClick={(e) => { e.stopPropagation(); handleOpenModal(category); }}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(category.id); }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="expand-icon">
                  {expandedIds.includes(category.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>
              
              {expandedIds.includes(category.id) && category.subcategories.length > 0 && (
                <div className="subcategories">
                  {category.subcategories.map((sub) => (
                    <div key={sub.id} className="subcategory-item">
                      <span className="sub-name">{sub.name}</span>
                      <span className="sub-count">{sub.productsCount} منتج</span>
                      <div className="category-actions">
                        <button className="action-btn small">
                          <Edit size={14} />
                        </button>
                        <button className="action-btn small delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="add-sub-btn">
                    <Plus size={16} />
                    إضافة تصنيف فرعي
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">اسم التصنيف (عربي)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">اسم التصنيف (إنجليزي)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الأيقونة (إيموجي)</label>
                  <input
                    type="text"
                    className="form-input icon-input"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📱"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'حفظ التغييرات' : 'إضافة التصنيف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
