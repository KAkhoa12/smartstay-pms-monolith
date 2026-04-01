import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type AppRoute = '/business/login' | '/business/register' | '/business/dashboard'

type RegisterForm = {
  companyName: string
  taxCode: string
  representative: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

type LoginForm = {
  email: string
  password: string
}

const DASHBOARD_STATS = [
  { title: 'Cơ sở lưu trú', value: '08', hint: '+2 trong 30 ngày' },
  { title: 'Đặt phòng mới', value: '126', hint: '+14.5% so với tuần trước' },
  { title: 'Doanh thu tạm tính', value: '1.240.000.000đ', hint: 'Từ 01/03 - 31/03' },
  { title: 'Yêu cầu hỗ trợ mở', value: '05', hint: '2 yêu cầu ưu tiên cao' },
]

const RECENT_ACTIVITIES = [
  { id: 'BK-2034', label: 'Khách sạn Sông Trăng nhận booking mới', time: '09:12', status: 'Mới' },
  { id: 'PM-1088', label: 'Đối soát thanh toán tháng 03 hoàn tất', time: '08:45', status: 'Hoàn tất' },
  { id: 'CS-3991', label: 'Yêu cầu cập nhật thông tin doanh nghiệp', time: 'Hôm qua', status: 'Đang xử lý' },
]

function resolveRoute(pathname: string): AppRoute {
  if (pathname.endsWith('/business/register')) return '/business/register'
  if (pathname.endsWith('/business/dashboard')) return '/business/dashboard'
  return '/business/login'
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyDisplayName, setCompanyDisplayName] = useState('Doanh nghiệp SmartStay')
  const [authMessage, setAuthMessage] = useState('')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  })

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    companyName: '',
    taxCode: '',
    representative: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const pageTitle = useMemo(() => {
    if (route === '/business/register') return 'Đăng ký doanh nghiệp'
    if (route === '/business/dashboard') return 'Dashboard doanh nghiệp'
    return 'Đăng nhập doanh nghiệp'
  }, [route])

  useEffect(() => {
    document.title = `Partner CMS | ${pageTitle}`
  }, [pageTitle])

  useEffect(() => {
    const onPopState = () => setRoute(resolveRoute(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (route === '/business/dashboard' && !isAuthenticated) {
      navigate('/business/login', true)
    }
  }, [isAuthenticated, route])

  const navigate = (next: AppRoute, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', next)
    } else {
      window.history.pushState({}, '', next)
    }

    setRoute(next)
    setAuthMessage('')
    setLoginError('')
    setRegisterError('')
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { email, password } = loginForm

    if (!email.trim() || !password.trim()) {
      setLoginError('Vui lòng nhập đầy đủ email và mật khẩu doanh nghiệp.')
      return
    }

    setIsAuthenticated(true)
    setCompanyDisplayName(email.split('@')[0] || 'Doanh nghiệp SmartStay')
    setAuthMessage('Đăng nhập thành công.')
    navigate('/business/dashboard')
  }

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const {
      companyName,
      taxCode,
      representative,
      email,
      phone,
      password,
      confirmPassword,
    } = registerForm

    if (
      !companyName.trim() ||
      !taxCode.trim() ||
      !representative.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim()
    ) {
      setRegisterError('Vui lòng điền đầy đủ thông tin đăng ký doanh nghiệp.')
      return
    }

    if (password.length < 8) {
      setRegisterError('Mật khẩu cần có ít nhất 8 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp.')
      return
    }

    setCompanyDisplayName(companyName)
    setAuthMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay.')
    setLoginForm((prev) => ({ ...prev, email }))
    navigate('/business/login')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthMessage('Bạn đã đăng xuất khỏi hệ thống doanh nghiệp.')
    navigate('/business/login', true)
  }

  return (
    <main className="partner-shell">
      <header className="partner-header">
        <div>
          <p className="partner-brand">SmartStay Partner CMS</p>
          <h1>{pageTitle}</h1>
        </div>

        <nav className="partner-nav">
          <button type="button" onClick={() => navigate('/business/login')}>
            Đăng nhập
          </button>
          <button type="button" onClick={() => navigate('/business/register')}>
            Đăng ký
          </button>
          <button type="button" onClick={() => navigate('/business/dashboard')}>
            Dashboard
          </button>
        </nav>
      </header>

      {authMessage ? <p className="alert success">{authMessage}</p> : null}

      {route === '/business/login' ? (
        <section className="auth-card">
          <h2>Đăng nhập tài khoản doanh nghiệp</h2>
          <p>Truy cập bảng điều khiển quản lý cơ sở lưu trú, phòng và doanh thu.</p>

          <form onSubmit={handleLogin} className="form-grid">
            <label>
              Email doanh nghiệp
              <input
                type="email"
                placeholder="partner@tencongty.vn"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>

            {loginError ? <p className="alert error">{loginError}</p> : null}

            <button type="submit" className="primary-btn">
              Đăng nhập
            </button>
          </form>

          <p className="helper">
            Chưa có tài khoản doanh nghiệp?{' '}
            <button type="button" className="inline-link" onClick={() => navigate('/business/register')}>
              Đăng ký ngay
            </button>
          </p>
        </section>
      ) : null}

      {route === '/business/register' ? (
        <section className="auth-card">
          <h2>Đăng ký tài khoản doanh nghiệp</h2>
          <p>Điền đầy đủ thông tin để đội vận hành SmartStay kích hoạt tài khoản cho bạn.</p>

          <form onSubmit={handleRegister} className="form-grid">
            <label>
              Tên doanh nghiệp
              <input
                type="text"
                placeholder="Công ty TNHH Du lịch ABC"
                value={registerForm.companyName}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, companyName: event.target.value }))
                }
              />
            </label>

            <label>
              Mã số thuế
              <input
                type="text"
                placeholder="0312345678"
                value={registerForm.taxCode}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, taxCode: event.target.value }))}
              />
            </label>

            <label>
              Người đại diện
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={registerForm.representative}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, representative: event.target.value }))
                }
              />
            </label>

            <label>
              Email liên hệ
              <input
                type="email"
                placeholder="contact@abc.vn"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>

            <label>
              Số điện thoại
              <input
                type="tel"
                placeholder="0901234567"
                value={registerForm.phone}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>

            <label>
              Xác nhận mật khẩu
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
              />
            </label>

            {registerError ? <p className="alert error">{registerError}</p> : null}

            <button type="submit" className="primary-btn">
              Đăng ký doanh nghiệp
            </button>
          </form>
        </section>
      ) : null}

      {route === '/business/dashboard' ? (
        <section className="dashboard">
          <div className="dashboard-head">
            <div>
              <h2>Xin chào, {companyDisplayName}</h2>
              <p>Tổng quan vận hành doanh nghiệp trong hệ thống SmartStay.</p>
            </div>

            <button type="button" className="secondary-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>

          <div className="stat-grid">
            {DASHBOARD_STATS.map((item) => (
              <article key={item.title} className="stat-card">
                <p className="stat-title">{item.title}</p>
                <p className="stat-value">{item.value}</p>
                <p className="stat-hint">{item.hint}</p>
              </article>
            ))}
          </div>

          <div className="activity-card">
            <h3>Hoạt động gần đây</h3>
            <ul>
              {RECENT_ACTIVITIES.map((item) => (
                <li key={item.id}>
                  <div>
                    <p className="activity-label">{item.label}</p>
                    <p className="activity-meta">
                      {item.id} • {item.time}
                    </p>
                  </div>
                  <span className="status-pill">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default App
