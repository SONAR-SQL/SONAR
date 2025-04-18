export interface Alert {
  id: string;
  type: 'whale_movement' | 'price_change' | 'volume_spike' | 'custom';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  token?: string;
  tokenSymbol?: string;
  timestamp: string;
  read: boolean;
  active: boolean;
}

export interface AlertSetting {
  id: string;
  type: 'whale_movement' | 'price_change' | 'volume_spike' | 'custom';
  name?: string;
  description?: string;
  enabled: boolean;
  minAmount?: number;
  threshold?: number;
  tokens?: string[];
  customCondition?: string;
  notificationChannels?: {
    email: boolean;
    push: boolean;
  };
}

export interface CreateAlertSettingRequest {
  type: 'whale_movement' | 'price_change' | 'volume_spike' | 'custom';
  name?: string;
  description?: string;
  enabled: boolean;
  minAmount?: number;
  threshold?: number;
  tokens?: string[];
  customCondition?: string;
  notificationChannels?: {
    email: boolean;
    push: boolean;
  };
}

export interface CreateCustomAlertRequest {
  title: string;
  description: string;
  token?: string;
  tokenSymbol?: string;
  severity?: 'low' | 'medium' | 'high';
} 