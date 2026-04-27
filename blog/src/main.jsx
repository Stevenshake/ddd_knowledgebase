import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BlogProvider } from './context/BlogContext'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import AdminPage from './pages/AdminPage'
import ArticleEditor from './pages/ArticleEditor'
import './index.css'

const Layout = ({ children }) => (
  <div className="app">
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Блог</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Статьи</Link>
          <Link to="/admin" className="nav-link admin">Админ</Link>
        </div>
      </div>
    </nav>
    <main className="main-content">
      {children}
    </main>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlogProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/create" element={<ArticleEditor />} />
            <Route path="/admin/edit/:slug" element={<ArticleEditor />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BlogProvider>
  </StrictMode>,
)
