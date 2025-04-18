import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMarketOverview, searchTokens, addToWatchlist, removeFromWatchlist } from '../redux/slices/marketSlice';
import { FaSearch, FaStar, FaRegStar, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import TokenDetails from '../components/TokenDetails';

const Market: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    topVolumeTokens, 
    topGainers, 
    topLosers, 
    whaleInterestTokens,
    searchResults,
    watchlist,
    loading
  } = useAppSelector(state => state.market);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('topVolume');

  useEffect(() => {
    dispatch(fetchMarketOverview());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchTokens(searchQuery));
    }
  };

  const handleAddToWatchlist = (tokenAddress: string) => {
    dispatch(addToWatchlist(tokenAddress));
  };

  const handleRemoveFromWatchlist = (tokenAddress: string) => {
    dispatch(removeFromWatchlist(tokenAddress));
  };

  const isInWatchlist = (tokenAddress: string) => {
    return watchlist.some(token => token.address === tokenAddress);
  };

  const handleTokenClick = (token: any) => {
    setSelectedToken(token);
  };

  const handleCloseDetails = () => {
    setSelectedToken(null);
  };

  const renderTokenList = (tokens: any[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Whale Interest
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tokens.map((token) => (
              <tr key={token.address} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTokenClick(token)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {token.symbol ? token.symbol.substring(0, 2) : 'XX'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${token.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm flex items-center ${
                    token.priceChange24h > 0 ? 'text-green-600' : token.priceChange24h < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {token.priceChange24h > 0 ? <FaArrowUp className="mr-1" /> : token.priceChange24h < 0 ? <FaArrowDown className="mr-1" /> : null}
                    {Math.abs(token.priceChange24h).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${token.volume24h.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{token.whaleInterest || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  {isAuthenticated && (
                    isInWatchlist(token.address) ? (
                      <button
                        onClick={() => handleRemoveFromWatchlist(token.address)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <FaStar size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToWatchlist(token.address)}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        <FaRegStar size={18} />
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Market Overview</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex rounded-md shadow-sm mb-4">
          <input
            type="text"
            placeholder="Search tokens by name, symbol, or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 flex-grow block w-full rounded-l-md sm:text-sm border-gray-300 py-2 px-4"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </form>

        {searchQuery && searchResults.length > 0 && (
          <div className="bg-white shadow overflow-hidden rounded-md mb-6">
            <h2 className="text-lg font-medium px-6 py-3 bg-gray-50">Search Results</h2>
            {renderTokenList(searchResults)}
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'topVolume'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('topVolume')}
            >
              Top Volume
            </button>
            <button
              className={`${
                activeTab === 'topGainers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('topGainers')}
            >
              Top Gainers
            </button>
            <button
              className={`${
                activeTab === 'topLosers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('topLosers')}
            >
              Top Losers
            </button>
            <button
              className={`${
                activeTab === 'whaleInterest'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('whaleInterest')}
            >
              Whale Interest
            </button>
            {isAuthenticated && (
              <button
                className={`${
                  activeTab === 'watchlist'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('watchlist')}
              >
                My Watchlist
              </button>
            )}
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'topVolume' && renderTokenList(topVolumeTokens)}
            {activeTab === 'topGainers' && renderTokenList(topGainers)}
            {activeTab === 'topLosers' && renderTokenList(topLosers)}
            {activeTab === 'whaleInterest' && renderTokenList(whaleInterestTokens)}
            {activeTab === 'watchlist' && renderTokenList(watchlist)}
          </div>
        )}
      </div>

      {selectedToken && (
        <TokenDetails token={selectedToken} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default Market; 