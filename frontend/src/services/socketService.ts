// @ts-ignore
import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { addAlert, Alert } from '../redux/slices/alertSlice';

interface WhaleMovementData {
  address: string;
  amount: number;
  token: string;
  timestamp: number;
  transaction: string;
}

interface PriceChangeData {
  token: string;
  symbol: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  timestamp: number;
}

interface VolumeSpikeData {
  token: string;
  symbol: string;
  volume: number;
  previousVolume: number;
  changePercent: number;
  timestamp: number;
}

// 声明ImportMeta环境变量类型
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

// 单例模式实现的Socket服务
class SocketService {
  private static instance: SocketService;
  private socket: any = null;
  private connected: boolean = false;

  private constructor() {
    // 私有构造函数，确保单例模式
  }

  // 获取实例的静态方法
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // 初始化socket连接
  public connect(userId?: string): void {
    if (this.connected) return;

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // 使用用户ID进行连接，以便后端可以将用户加入私人房间
    this.socket = io(baseURL, {
      query: userId ? { userId } : undefined,
      transports: ['websocket', 'polling'],
    });

    this.setupListeners();
    this.connected = true;
    console.log('Socket连接已初始化');
  }

  // 断开socket连接
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket连接已断开');
    }
  }

  // 设置监听器
  private setupListeners(): void {
    if (!this.socket) return;

    // 连接事件
    this.socket.on('connect', () => {
      console.log('Socket已连接');
    });

    // 断开连接事件
    this.socket.on('disconnect', (reason: string) => {
      console.log(`Socket断开连接: ${reason}`);
      this.connected = false;
    });

    // 接收新警报
    this.socket.on('new_alert', (alert: Alert) => {
      console.log('收到新警报:', alert);
      store.dispatch(addAlert(alert));
    });

    // 接收大额交易通知
    this.socket.on('whale_movement', (data: WhaleMovementData) => {
      console.log('收到大额交易:', data);
    });

    // 接收价格变动通知
    this.socket.on('price_change', (data: PriceChangeData) => {
      console.log('收到价格变动:', data);
    });

    // 接收交易量突增通知
    this.socket.on('volume_spike', (data: VolumeSpikeData) => {
      console.log('收到交易量突增:', data);
    });

    // 错误处理
    this.socket.on('error', (error: Error) => {
      console.error('Socket错误:', error);
    });
  }

  // 订阅事件
  public subscribe(eventType: string): void {
    if (this.socket && this.connected) {
      this.socket.emit('subscribe', eventType);
      console.log(`已订阅 ${eventType} 事件`);
    }
  }

  // 取消订阅事件
  public unsubscribe(eventType: string): void {
    if (this.socket && this.connected) {
      this.socket.emit('unsubscribe', eventType);
      console.log(`已取消订阅 ${eventType} 事件`);
    }
  }

  // 订阅特定代币
  public subscribeToken(tokenAddress: string): void {
    if (this.socket && this.connected) {
      this.socket.emit('subscribe_token', tokenAddress);
      console.log(`已订阅代币 ${tokenAddress}`);
    }
  }

  // 取消订阅特定代币
  public unsubscribeToken(tokenAddress: string): void {
    if (this.socket && this.connected) {
      this.socket.emit('unsubscribe_token', tokenAddress);
      console.log(`已取消订阅代币 ${tokenAddress}`);
    }
  }

  // 发送自定义事件
  public emit(event: string, data: unknown): void {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }
}

// 导出单例实例
export const socketService = SocketService.getInstance();
export default socketService; 