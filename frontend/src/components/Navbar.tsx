import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiNotification3Line, RiUser3Line, RiLogoutBoxRLine, RiSearch2Line } from 'react-icons/ri'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { logout } from '../redux/slices/authSlice'
import logoImage from '../assets/sonar-logo.svg'

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { unreadCount } = useAppSelector((state) => state.alert)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700 py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="mr-4">
            <img src={logoImage} alt="SONAR" className="h-8" />
          </Link>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="搜索代币、钱包地址..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <RiSearch2Line className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/alerts" className="relative">
            <RiNotification3Line size={22} className="text-slate-300 hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <RiUser3Line size={18} />
              </div>
              <span className="hidden md:inline-block">
                {isAuthenticated ? user?.username : '游客'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-10">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <RiUser3Line size={16} />
                      <span>个人中心</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <RiLogoutBoxRLine size={16} />
                      <span>退出登录</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>登录</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>注册</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar 