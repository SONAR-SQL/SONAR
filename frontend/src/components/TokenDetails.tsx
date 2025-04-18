import React, { useEffect, useState } from 'react';
import { FaTimes, FaChartLine, FaExternalLinkAlt, FaRegClock } from 'react-icons/fa';
import axios from 'axios';

interface TokenDetailsProps {
  token: {
    address: string;
    symbol: string;
    name: string;
    price: number;
    priceChange24h: number;
    volume24h: number;
    whaleInterest: number;
  };
  onClose: () => void;
}

interface PriceHistoryPoint {
  timestamp: string;
  price: number;
  volume: number;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({ token, onClose }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [period, setPeriod] = useState<string>('24h');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPriceHistory();
  }, [token.address, period]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/market/token/${token.address}/history?period=${period}`);
      setPriceHistory(response.data.data.priceHistory);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
              {token.symbol ? token.symbol.substring(0, 2) : 'XX'}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{token.name}</h2>
              <p className="text-gray-500">{token.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Price Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-xl font-semibold">${token.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">24h Change</p>
                  <p className={`text-xl font-semibold ${
                    token.priceChange24h > 0 ? 'text-green-600' : token.priceChange24h < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="text-xl font-semibold">${token.volume24h.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Whale Interest</p>
                  <p className="text-xl font-semibold">{token.whaleInterest || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-4">Token Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Token Address</p>
                  <p className="text-sm text-gray-900 font-mono truncate ml-4 max-w-xs">
                    {token.address}
                    <a 
                      href={`https://explorer.solana.com/address/${token.address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaExternalLinkAlt size={12} />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Price History</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPeriod('24h')}
                  className={`px-2 py-1 text-xs rounded ${
                    period === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  24H
                </button>
                <button
                  onClick={() => setPeriod('7d')}
                  className={`px-2 py-1 text-xs rounded ${
                    period === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setPeriod('30d')}
                  className={`px-2 py-1 text-xs rounded ${
                    period === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  30D
                </button>
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : priceHistory.length > 0 ? (
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaChartLine size={64} className="text-gray-200" />
                  <p className="absolute text-gray-500 text-sm">Chart visualization would be here</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <FaRegClock className="mr-2" /> No historical data available
              </div>
            )}

            {priceHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Price Points</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {priceHistory.slice(0, 5).map((point, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-500">{new Date(point.timestamp).toLocaleString()}</span>
                      <span className="font-medium">${point.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails; 