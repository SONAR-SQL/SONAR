import { NavLink } from 'react-router-dom'
import { RiDashboardLine, RiRadarLine, RiLineChartLine, RiAlarmWarningLine, RiUserLine } from 'react-icons/ri'
import { useAppSelector } from '../redux/hooks'

const Sidebar = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const navItems = [
    { path: '/', icon: <RiDashboardLine size={20} />, label: '仪表盘' },
    { path: '/whale-radar', icon: <RiRadarLine size={20} />, label: '鲸鱼雷达' },
    { path: '/market-intel', icon: <RiLineChartLine size={20} />, label: '市场情报' },
    { path: '/alerts', icon: <RiAlarmWarningLine size={20} />, label: '预警系统' },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">SONAR</h1>
        <p className="text-xs text-slate-400 mt-1">AI交易情报官</p>
      </div>

      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="px-2 py-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
          
          {isAuthenticated && (
            <li className="px-2 py-1">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <RiUserLine size={20} />
                <span>个人中心</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 p-3 rounded-lg">
          <h3 className="font-medium text-sm">代币发射</h3>
          <p className="text-xs text-slate-400 mt-1">SONAR 代币现已发射</p>
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
          >
            查看合约 →
          </a>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 