import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login - في الإنتاج استخدم Firebase Auth
    setTimeout(() => {
      if (email === 'admin@jaboory.com' && password === 'admin123') {
        setUser({
          id: '1',
          email: 'admin@jaboory.com',
          name: 'المدير',
          role: 'admin',
          addresses: [],
          createdAt: new Date()
        });
        navigate('/dashboard');
      } else if (email && password) {
        setUser({
          id: '2',
          email: email,
          name: 'عميل',
          role: 'customer',
          addresses: [],
          createdAt: new Date()
        });
        navigate('/');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-text">جبوري</span>
              <span className="logo-sub">للإلكترونيات</span>
            </Link>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بك مجدداً! سجل دخولك للمتابعة</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-icon">
                <Mail size={20} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div className="input-icon">
                <Lock size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>تذكرني</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="login-divider">
            <span>أو</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <span>G</span>
              تسجيل بحساب Google
            </button>
          </div>

          <div className="login-footer">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/register">إنشاء حساب جديد</Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p><strong>للتجربة:</strong></p>
            <p>المدير: admin@jaboory.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
