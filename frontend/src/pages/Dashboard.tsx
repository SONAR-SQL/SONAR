import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchTopTokens, fetchMarketOverview } from '../redux/slices/marketSlice'
import { fetchRecentActivities } from '../redux/slices/whaleSlice'
import { fetchAlerts } from '../redux/slices/alertSlice'
import { socketService } from '../services/socketService'
import WhaleActivityCard from '../components/WhaleActivityCard'
import MarketOverview from '../components/MarketOverview'
import AlertSummary from '../components/AlertSummary'
import { FaChartLine, FaWater, FaBell, FaExclamationTriangle, FaUser } from 'react-icons/fa'

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { topTokens, topGainers, topLosers } = useAppSelector((state) => state.market)
  const { recentActivities } = useAppSelector((state) => state.whale)
  const { alerts, unreadCount } = useAppSelector((state) => state.alert)
  const unreadAlerts = alerts.filter((alert) => !alert.read)

  useEffect(() => {
    dispatch(fetchTopTokens())
    dispatch(fetchRecentActivities())
    dispatch(fetchMarketOverview())
    if (isAuthenticated) {
      dispatch(fetchAlerts())
    }
  }, [dispatch, isAuthenticated])

  // 为排名靠前的代币订阅实时更新
  useEffect(() => {
    if (topTokens.length > 0 && isAuthenticated) {
      // 订阅排名前5的代币
      topTokens.slice(0, 5).forEach(token => {
        if (token.address) {
          socketService.subscribeToken(token.address);
          console.log(`已为代币 ${token.symbol} 订阅实时更新`);
        }
      });
    }

    // 清理函数 - 取消订阅
    return () => {
      if (topTokens.length > 0) {
        topTokens.slice(0, 5).forEach(token => {
          if (token.address) {
            socketService.unsubscribeToken(token.address);
          }
        });
      }
    };
  }, [topTokens, isAuthenticated]);

  // 获取最新的三个警报
  const recentAlerts = alerts.slice(0, 3)

  // 获取顶级涨幅币种
  const topGainersList = topGainers.slice(0, 5)

  // 获取顶级跌幅币种
  const topLosersList = topLosers.slice(0, 5)

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {!isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                You are not logged in. <Link to="/auth" className="font-medium underline">Sign in</Link> to see personalized data and set up alerts.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Card - Market Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FaChartLine className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Market Activity</p>
              <p className="text-lg font-semibold">Active</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/market" className="text-sm text-blue-500 hover:text-blue-700">View market details →</Link>
          </div>
        </div>
        
        {/* Stats Card - Whale Movements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
              <FaWater className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Whale Movements</p>
              <p className="text-lg font-semibold">Tracking</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/whale-radar" className="text-sm text-indigo-500 hover:text-indigo-700">Check whale radar →</Link>
          </div>
        </div>
        
        {/* Stats Card - Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FaBell className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Alerts</p>
              <p className="text-lg font-semibold">{unreadCount} Unread</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/alerts" className="text-sm text-red-500 hover:text-red-700">View all alerts →</Link>
          </div>
        </div>
        
        {/* Stats Card - Account */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FaUser className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Account</p>
              <p className="text-lg font-semibold">{isAuthenticated ? 'Active' : 'Guest'}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to={isAuthenticated ? "/profile" : "/auth"} className="text-sm text-green-500 hover:text-green-700">
              {isAuthenticated ? 'View profile →' : 'Sign in →'}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Movers */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Market Movers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Gainers */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Top Gainers</h3>
                <div className="space-y-2">
                  {topGainersList.length > 0 ? (
                    topGainersList.map((token) => (
                      <div key={token.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{token.symbol}</span>
                          <span className="ml-2 text-xs text-gray-500">{token.name}</span>
                        </div>
                        <div className="text-green-600 font-medium">+{token.priceChange24h.toFixed(2)}%</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">Loading market data...</div>
                  )}
                </div>
              </div>
              
              {/* Top Losers */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Top Losers</h3>
                <div className="space-y-2">
                  {topLosersList.length > 0 ? (
                    topLosersList.map((token) => (
                      <div key={token.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{token.symbol}</span>
                          <span className="ml-2 text-xs text-gray-500">{token.name}</span>
                        </div>
                        <div className="text-red-600 font-medium">{token.priceChange24h.toFixed(2)}%</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">Loading market data...</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/market" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Full Market
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Alerts</h2>
              <span className="text-sm text-blue-600">{alerts.length} Total</span>
            </div>
            
            {isAuthenticated ? (
              <>
                <div className="space-y-4">
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map((alert) => (
                      <div key={alert.id} className={`p-3 border-l-4 rounded-r-md ${alert.read ? 'border-gray-300 bg-gray-50' : 'border-red-500 bg-red-50'}`}>
                        <div className="flex justify-between">
                          <span className="font-medium">{alert.title}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        {alert.tokenSymbol && (
                          <div className="text-xs text-gray-500 mt-1">
                            Token: {alert.tokenSymbol}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No recent alerts</div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <Link to="/alerts" className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    View All Alerts
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FaBell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Sign in to see your alerts</p>
                <Link to="/auth" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 