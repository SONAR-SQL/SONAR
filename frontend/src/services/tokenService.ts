import api from '../api';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  network: string;
  decimals: number;
  logoUrl: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  rank: number;
}

export interface TokenPriceHistory {
  timestamp: number;
  price: number;
  volume: number;
}

export interface TokenSearchParams {
  query?: string;
  network?: string;
  limit?: number;
  offset?: number;
}

class TokenService {
  /**
   * 获取热门代币列表
   */
  async getTopTokens(limit = 100): Promise<Token[]> {
    try {
      const response = await api.get('/tokens/top', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('获取热门代币失败:', error);
      throw error;
    }
  }

  /**
   * 按ID获取代币详情
   */
  async getTokenById(id: string): Promise<Token> {
    try {
      const response = await api.get(`/tokens/${id}`);
      return response.data;
    } catch (error) {
      console.error(`获取代币 ${id} 详情失败:`, error);
      throw error;
    }
  }

  /**
   * 按地址获取代币详情
   */
  async getTokenByAddress(address: string, network = 'ethereum'): Promise<Token> {
    try {
      const response = await api.get(`/tokens/address/${address}`, {
        params: { network }
      });
      return response.data;
    } catch (error) {
      console.error(`获取代币地址 ${address} 详情失败:`, error);
      throw error;
    }
  }

  /**
   * 搜索代币
   */
  async searchTokens(params: TokenSearchParams): Promise<Token[]> {
    try {
      const response = await api.get('/tokens/search', { params });
      return response.data;
    } catch (error) {
      console.error('搜索代币失败:', error);
      throw error;
    }
  }

  /**
   * 获取代币历史价格数据
   */
  async getTokenPriceHistory(id: string, timeframe: '1d' | '7d' | '30d' | '90d' | '1y' | 'all'): Promise<TokenPriceHistory[]> {
    try {
      const response = await api.get(`/tokens/${id}/history`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error(`获取代币 ${id} 价格历史失败:`, error);
      throw error;
    }
  }

  /**
   * 获取用户关注的代币列表
   */
  async getWatchlist(): Promise<Token[]> {
    try {
      const response = await api.get('/users/watchlist');
      return response.data;
    } catch (error) {
      console.error('获取关注列表失败:', error);
      throw error;
    }
  }

  /**
   * 添加代币到关注列表
   */
  async addToWatchlist(tokenId: string): Promise<void> {
    try {
      await api.post('/users/watchlist', { tokenId });
    } catch (error) {
      console.error(`添加代币 ${tokenId} 到关注列表失败:`, error);
      throw error;
    }
  }

  /**
   * 从关注列表移除代币
   */
  async removeFromWatchlist(tokenId: string): Promise<void> {
    try {
      await api.delete(`/users/watchlist/${tokenId}`);
    } catch (error) {
      console.error(`从关注列表移除代币 ${tokenId} 失败:`, error);
      throw error;
    }
  }
}

export default new TokenService(); 