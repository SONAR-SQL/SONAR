import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchTopWhales, fetchRecentActivities, trackWallet } from '../redux/slices/whaleSlice'
import type { WhaleWallet, WhaleActivity } from '../redux/slices/whaleSlice'
import { RiSearchLine, RiFilter3Line } from 'react-icons/ri'
import { socketService } from '../services/socketService'

const WhaleRadar = () => {
  const dispatch = useAppDispatch()
  const { wallets, recentActivities, loading } = useAppSelector((state) => state.whale)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [trackAddress, setTrackAddress] = useState('')
  const [liveNotification, setLiveNotification] = useState<{
    show: boolean;
    message: string;
    timestamp: number;
  }>({
    show: false,
    message: '',
    timestamp: 0
  });

  // 实时交易通知
  const showNotification = useCallback((message: string) => {
    setLiveNotification({
      show: true,
      message,
      timestamp: Date.now()
    });

    // 5秒后隐藏通知
    setTimeout(() => {
      setLiveNotification(prev => ({
        ...prev,
        show: false
      }));
    }, 5000);
  }, []);

  useEffect(() => {
    dispatch(fetchTopWhales())
    dispatch(fetchRecentActivities())
  }, [dispatch])

  // 添加Socket实时更新功能
  useEffect(() => {
    if (isAuthenticated) {
      // 订阅大额交易事件
      socketService.subscribe('whale_movement');
      
      // 创建事件处理函数
      const handleWhaleMovement = (data: any) => {
        console.log('实时大额交易数据:', data);
        
        // 显示实时通知
        showNotification(`检测到大额交易: ${data.amount} ${data.token} (${data.address.substring(0, 6)}...)`);
        
        // 获取最新的活动列表
        dispatch(fetchRecentActivities());
      };
      
      // 监听自定义事件
      document.addEventListener('whale_movement_received', (e: any) => handleWhaleMovement(e.detail));
      
      // 清理函数
      return () => {
        socketService.unsubscribe('whale_movement');
        document.removeEventListener('whale_movement_received', (e: any) => handleWhaleMovement(e.detail));
      };
    }
  }, [dispatch, isAuthenticated, showNotification]);

  const handleTrackWallet = () => {
    if (trackAddress.trim()) {
      dispatch(trackWallet(trackAddress.trim()))
      setTrackAddress('')
    }
  }

  const filteredActivities = recentActivities.filter((activity) => {
    const matchesSearch =
      searchTerm === '' ||
      activity.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || activity.type === filterType
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">鲸鱼雷达</h1>
      <p className="text-slate-400 mb-6">实时监控大户行为，捕捉市场动向</p>

      {/* 实时通知组件 */}
      {liveNotification.show && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-300 animate-pulse"></span>
            </div>
            <div>
              <p className="font-medium">实时更新</p>
              <p className="text-sm">{liveNotification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="bg-slate-700 rounded-lg p-5 h-full">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="搜索钱包地址或代币..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg py-2 px-4 text-sm hover:bg-slate-750"
                >
                  <RiFilter3Line size={18} />
                  筛选
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setFilterType('all')
                        setShowFilterMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${
                        filterType === 'all' ? 'bg-slate-700' : ''
                      }`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('transfer')
                        setShowFilterMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${
                        filterType === 'transfer' ? 'bg-slate-700' : ''
                      }`}
                    >
                      转账
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('swap')
                        setShowFilterMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${
                        filterType === 'swap' ? 'bg-slate-700' : ''
                      }`}
                    >
                      兑换
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('liquidity')
                        setShowFilterMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 ${
                        filterType === 'liquidity' ? 'bg-slate-700' : ''
                      }`}
                    >
                      流动性
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-400 text-sm border-b border-slate-600">
                    <th className="pb-3 font-medium">钱包地址</th>
                    <th className="pb-3 font-medium">类型</th>
                    <th className="pb-3 font-medium">代币</th>
                    <th className="pb-3 font-medium">金额</th>
                    <th className="pb-3 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      </td>
                    </tr>
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-slate-600 hover:bg-slate-750">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <div className="font-medium truncate w-32">
                                {activity.address.substring(0, 6)}...
                                {activity.address.substring(activity.address.length - 4)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              activity.type === 'transfer'
                                ? 'bg-green-900 text-green-300'
                                : activity.type === 'swap'
                                ? 'bg-blue-900 text-blue-300'
                                : activity.type === 'liquidity'
                                ? 'bg-purple-900 text-purple-300'
                                : 'bg-slate-900 text-slate-300'
                            }`}
                          >
                            {activity.type === 'transfer'
                              ? '转账'
                              : activity.type === 'swap'
                              ? '兑换'
                              : activity.type === 'liquidity'
                              ? '流动性'
                              : activity.type}
                          </span>
                        </td>
                        <td className="py-4">{activity.tokenSymbol}</td>
                        <td className="py-4 font-medium">${activity.amount.toLocaleString()}</td>
                        <td className="py-4 text-slate-400 text-sm">
                          {new Date(activity.timestamp).toLocaleString('zh-CN', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        没有找到符合条件的记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-slate-700 rounded-lg p-5 mb-6">
            <h2 className="text-lg font-semibold mb-4">大户追踪</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="输入钱包地址..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={trackAddress}
                onChange={(e) => setTrackAddress(e.target.value)}
              />
              <button
                onClick={handleTrackWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                追踪
              </button>
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">热门大户</h2>
            <div className="space-y-3">
              {wallets.slice(0, 5).map((wallet) => (
                <div key={wallet.address} className="p-3 bg-slate-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium truncate w-32">
                        {wallet.label || `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        最后活动: {new Date(wallet.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${wallet.totalValue.toLocaleString()}</div>
                      <div className="text-xs mt-1">
                        {wallet.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-slate-700 px-1.5 py-0.5 rounded mr-1 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {wallets.length === 0 && (
                <div className="text-center py-4 text-slate-400">暂无数据</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhaleRadar 