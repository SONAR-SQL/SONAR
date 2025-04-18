import { useState } from 'react'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'

const MarketOverview = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  // 模拟数据
  const marketData = {
    totalMarketCap: 2847900000000,
    dominance: {
      SOL: 3.2,
      BTC: 51.4,
      ETH: 16.8,
    },
    tvl: {
      total: 32500000000,
      change: -2.4,
    },
    dailyVolume: 108700000000,
    fearGreedIndex: 65, // 0-100
  }

  const getGreedColorClass = (value: number) => {
    if (value <= 25) return 'text-red-500'
    if (value <= 45) return 'text-orange-500'
    if (value <= 55) return 'text-yellow-500'
    if (value <= 75) return 'text-lime-500'
    return 'text-green-500'
  }

  const getGreedLabel = (value: number) => {
    if (value <= 25) return '极度恐慌'
    if (value <= 45) return '恐慌'
    if (value <= 55) return '中性'
    if (value <= 75) return '贪婪'
    return '极度贪婪'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`
    }
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    }
    return `$${num.toLocaleString()}`
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-400">更新时间: {new Date().toLocaleString()}</div>
        <div className="flex text-sm rounded-lg overflow-hidden">
          <button
            className={`px-3 py-1 ${
              timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </button>
          <button
            className={`px-3 py-1 ${
              timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
            onClick={() => setTimeRange('7d')}
          >
            7d
          </button>
          <button
            className={`px-3 py-1 ${
              timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
            onClick={() => setTimeRange('30d')}
          >
            30d
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-sm text-slate-400">总市值</div>
          <div className="text-lg font-bold mt-1">{formatNumber(marketData.totalMarketCap)}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-sm text-slate-400">24h交易量</div>
          <div className="text-lg font-bold mt-1">{formatNumber(marketData.dailyVolume)}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">市场占比</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-8 bg-slate-700 rounded-full overflow-hidden flex">
            <div
              className="bg-orange-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${marketData.dominance.BTC}%` }}
            >
              BTC
            </div>
            <div
              className="bg-blue-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${marketData.dominance.ETH}%` }}
            >
              ETH
            </div>
            <div
              className="bg-purple-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${marketData.dominance.SOL}%` }}
            >
              SOL
            </div>
            <div className="flex-1 h-full"></div>
          </div>
        </div>
        <div className="flex text-xs text-slate-400 justify-between mt-2">
          <div>
            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
            BTC {marketData.dominance.BTC}%
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            ETH {marketData.dominance.ETH}%
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
            SOL {marketData.dominance.SOL}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-sm text-slate-400">总锁仓量</div>
          <div className="text-lg font-bold mt-1">{formatNumber(marketData.tvl.total)}</div>
          <div
            className={`text-xs flex items-center ${
              marketData.tvl.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {marketData.tvl.change >= 0 ? (
              <RiArrowUpSLine size={16} />
            ) : (
              <RiArrowDownSLine size={16} />
            )}
            {Math.abs(marketData.tvl.change)}%
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-sm text-slate-400">恐惧与贪婪指数</div>
          <div
            className={`text-lg font-bold mt-1 ${getGreedColorClass(marketData.fearGreedIndex)}`}
          >
            {marketData.fearGreedIndex}
          </div>
          <div className={`text-xs ${getGreedColorClass(marketData.fearGreedIndex)}`}>
            {getGreedLabel(marketData.fearGreedIndex)}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500">
        数据来源: CoinGecko, DeFiLlama
      </div>
    </div>
  )
}

export default MarketOverview 