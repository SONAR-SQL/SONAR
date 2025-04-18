import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaRegStar, FaExchangeAlt, FaExternalLinkAlt } from 'react-icons/fa';
import tokenService, { Token, TokenPriceHistory } from '../services/tokenService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TokenDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<Token | null>(null);
  const [priceHistory, setPriceHistory] = useState<TokenPriceHistory[]>([]);
  const [timeframe, setTimeframe] = useState<'1d' | '7d' | '30d' | '90d' | '1y' | 'all'>('7d');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // 获取代币信息
        const tokenData = await tokenService.getTokenById(id);
        setToken(tokenData);
        
        // 获取价格历史
        const historyData = await tokenService.getTokenPriceHistory(id, timeframe);
        setPriceHistory(historyData);
        
        // 检查是否在用户的关注列表中
        try {
          const watchlist = await tokenService.getWatchlist();
          setIsInWatchlist(watchlist.some(t => t.id === id));
        } catch (e) {
          // 关注列表可能需要登录，所以这个错误可以忽略
          console.log('获取关注列表失败，用户可能未登录');
        }
      } catch (err) {
        console.error('获取代币详情失败:', err);
        setError('无法加载代币数据。请稍后重试。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, timeframe]);

  const handleToggleWatchlist = async () => {
    if (!token) return;
    
    try {
      if (isInWatchlist) {
        await tokenService.removeFromWatchlist(token.id);
        setIsInWatchlist(false);
      } else {
        await tokenService.addToWatchlist(token.id);
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error('更新关注列表失败:', err);
      // 这里可以添加提示消息
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeframe === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">错误！</strong>
          <span className="block sm:inline"> {error || '找不到代币信息'}</span>
        </div>
        <div className="mt-4">
          <Link to="/markets" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> 返回市场
          </Link>
        </div>
      </div>
    );
  }

  const priceChangeColor = token.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600';
  
  // 价格格式化，根据价格范围选择合适的小数位数
  const formatPrice = (price: number) => {
    if (price < 0.000001) return price.toExponential(4);
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    if (price < 10) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // 格式化大数字（例如市值、成交量等）
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回链接 */}
      <div className="mb-6">
        <Link to="/markets" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" /> 返回市场
        </Link>
      </div>
      
      {/* 代币标题和基本信息 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <img 
            src={token.logoUrl} 
            alt={token.name} 
            className="w-12 h-12 mr-4 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=' + token.symbol;
            }}
          />
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              {token.name} ({token.symbol})
              <span className="ml-3 text-sm bg-gray-200 px-2 py-1 rounded">
                # {token.rank}
              </span>
            </h1>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <span className="mr-4">
                网络: {token.network.toUpperCase()}
              </span>
              <a 
                href={`https://etherscan.io/token/${token.address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600"
              >
                查看合约 <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={handleToggleWatchlist}
            className="mr-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            title={isInWatchlist ? "从关注列表移除" : "添加到关注列表"}
          >
            {isInWatchlist ? (
              <FaStar className="text-yellow-500 text-xl" />
            ) : (
              <FaRegStar className="text-gray-600 text-xl" />
            )}
          </button>
          
          <Link 
            to={`/trade/${token.symbol}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            <FaExchangeAlt className="mr-2" /> 交易
          </Link>
        </div>
      </div>
      
      {/* 价格信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end mb-6">
          <div className="mr-6 mb-4 md:mb-0">
            <span className="text-gray-500 dark:text-gray-400 text-sm">当前价格</span>
            <h2 className="text-4xl font-bold">${formatPrice(token.price)}</h2>
          </div>
          <div>
            <span className="text-sm">24小时变化</span>
            <div className={`text-xl font-semibold ${priceChangeColor}`}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {/* 价格图表时间范围选择器 */}
        <div className="flex mb-4 overflow-x-auto">
          {(['1d', '7d', '30d', '90d', '1y', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 mr-2 rounded-full text-sm ${
                timeframe === t 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t === '1d' ? '1天' : 
               t === '7d' ? '7天' : 
               t === '30d' ? '30天' : 
               t === '90d' ? '90天' : 
               t === '1y' ? '1年' : '全部'}
            </button>
          ))}
        </div>
        
        {/* 价格图表 */}
        <div className="h-80">
          {priceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => `$${formatPrice(value)}`} 
                />
                <Tooltip 
                  formatter={(value: number) => [`$${formatPrice(value)}`, '价格']}
                  labelFormatter={(label) => formatDate(label as number)}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              没有可用的价格历史数据
            </div>
          )}
        </div>
      </div>
      
      {/* 市场数据 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">市场数据</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">市值</span>
              <span className="font-medium">${formatLargeNumber(token.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">24小时交易量</span>
              <span className="font-medium">${formatLargeNumber(token.volume24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">流通量</span>
              <span className="font-medium">{formatLargeNumber(token.circulatingSupply)} {token.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">总供应量</span>
              <span className="font-medium">{formatLargeNumber(token.totalSupply)} {token.symbol}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">代币信息</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">合约地址</span>
              <span className="font-medium truncate max-w-xs">
                <a 
                  href={`https://etherscan.io/token/${token.address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {`${token.address.substring(0, 8)}...${token.address.substring(token.address.length - 8)}`}
                </a>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">网络</span>
              <span className="font-medium">{token.network.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">精度</span>
              <span className="font-medium">{token.decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">代币排名</span>
              <span className="font-medium">#{token.rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails; 