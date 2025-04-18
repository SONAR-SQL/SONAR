import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAlertSettings, updateAlertSetting } from '../redux/slices/alertSlice';
import { AlertSetting } from '../types/alertTypes';
import { FaTimes, FaCog, FaBell, FaChartLine, FaWater } from 'react-icons/fa';

interface AlertSettingsModalProps {
  onClose: () => void;
}

const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.alert);
  const [editingSetting, setEditingSetting] = useState<AlertSetting | null>(null);

  useEffect(() => {
    dispatch(fetchAlertSettings());
  }, [dispatch]);

  const handleToggleSwitch = (setting: AlertSetting) => {
    dispatch(
      updateAlertSetting({
        ...setting,
        enabled: !setting.enabled,
      })
    );
  };

  const handleEdit = (setting: AlertSetting) => {
    setEditingSetting(setting);
  };

  const handleSave = () => {
    if (editingSetting) {
      dispatch(updateAlertSetting(editingSetting));
      setEditingSetting(null);
    }
  };

  const handleCancel = () => {
    setEditingSetting(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingSetting) return;

    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name.startsWith('notification.')) {
      const channel = name.split('.')[1];
      setEditingSetting({
        ...editingSetting,
        notificationChannels: {
          ...editingSetting.notificationChannels,
          [channel]: checked,
        },
      });
    } else if (type === 'number') {
      setEditingSetting({
        ...editingSetting,
        [name]: parseFloat(value),
      });
    } else {
      setEditingSetting({
        ...editingSetting,
        [name]: value,
      });
    }
  };

  const getSettingIcon = (type: string) => {
    switch (type) {
      case 'whale_movement':
        return <FaWater className="text-blue-500" />;
      case 'price_change':
        return <FaChartLine className="text-green-500" />;
      case 'volume_spike':
        return <FaChartLine className="text-purple-500" />;
      case 'custom':
        return <FaCog className="text-orange-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getSettingTitle = (type: string) => {
    switch (type) {
      case 'whale_movement':
        return 'Whale Movement Alerts';
      case 'price_change':
        return 'Price Change Alerts';
      case 'volume_spike':
        return 'Volume Spike Alerts';
      case 'custom':
        return 'Custom Alerts';
      default:
        return 'Alert Settings';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <FaCog className="mr-2" /> Alert Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {settings.map((setting) => (
                <div key={setting.id} className="border rounded-lg p-4">
                  {editingSetting && editingSetting.id === setting.id ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        {getSettingIcon(setting.type)} 
                        <span className="ml-2">{getSettingTitle(setting.type)}</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {setting.type === 'whale_movement' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Minimum Transaction Amount ($)
                            </label>
                            <input
                              type="number"
                              name="minAmount"
                              value={editingSetting.minAmount || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {(setting.type === 'price_change' || setting.type === 'volume_spike') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {setting.type === 'price_change' ? 'Price Change Threshold (%)' : 'Volume Increase Threshold (%)'}
                            </label>
                            <input
                              type="number"
                              name="threshold"
                              value={editingSetting.threshold || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Channels
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="notification.email"
                                checked={editingSetting.notificationChannels?.email || false}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Email</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="notification.push"
                                checked={editingSetting.notificationChannels?.push || false}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Push Notification</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium flex items-center">
                          {getSettingIcon(setting.type)} 
                          <span className="ml-2">{getSettingTitle(setting.type)}</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(setting)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={setting.enabled}
                              onChange={() => handleToggleSwitch(setting)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        {setting.type === 'whale_movement' && (
                          <p>Alert when whale transactions exceed ${setting.minAmount?.toLocaleString()}</p>
                        )}
                        {setting.type === 'price_change' && (
                          <p>Alert on price changes greater than {setting.threshold}%</p>
                        )}
                        {setting.type === 'volume_spike' && (
                          <p>Alert on volume increases greater than {setting.threshold}%</p>
                        )}
                        {setting.type === 'custom' && setting.description && (
                          <p>{setting.description}</p>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Notifications: {[
                          setting.notificationChannels?.email && 'Email',
                          setting.notificationChannels?.push && 'Push'
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertSettingsModal; 