import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { checkAuth } from './redux/slices/authSlice'
import { socketService } from './services/socketService'

// Layouts
import Layout from './components/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import WhaleRadar from './pages/WhaleRadar'
import Alerts from './pages/Alerts'
import Market from './pages/Market'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Private route component
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? element : <Navigate to="/auth" />
}

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth)

  // 检查用户认证状态
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // Socket连接管理
  useEffect(() => {
    // 用户登录后初始化Socket连接
    if (isAuthenticated && user && !loading) {
      socketService.connect(user.id)
      
      // 订阅所需的事件
      socketService.subscribe('whale_movement')
      socketService.subscribe('price_change')
      socketService.subscribe('volume_spike')
    } else if (!isAuthenticated && !loading) {
      // 用户登出后断开Socket连接
      socketService.disconnect()
    }
    
    // 组件卸载时断开连接
    return () => {
      socketService.disconnect()
    }
  }, [isAuthenticated, user, loading])

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route
            path="dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="whale-radar"
            element={<PrivateRoute element={<WhaleRadar />} />}
          />
          <Route
            path="alerts"
            element={<PrivateRoute element={<Alerts />} />}
          />
          <Route path="market" element={<Market />} />
          <Route
            path="profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App 