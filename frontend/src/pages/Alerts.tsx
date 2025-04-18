import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAlerts, markAlertAsRead, markAllAsRead } from '../redux/slices/alertSlice';
import { Alert } from '../types/alertTypes';
import AlertSettingsModal from '../components/AlertSettingsModal';
import { FaBell, FaCheck, FaCheckDouble, FaCog } from 'react-icons/fa';

const Alerts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, loading } = useAppSelector((state) => state.alert);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAlertAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const toggleSettingsModal = () => {
    setShowSettings(!showSettings);
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'whale_movement':
        return 'bg-blue-100 text-blue-800';
      case 'price_change':
        return 'bg-green-100 text-green-800';
      case 'volume_spike':
        return 'bg-purple-100 text-purple-800';
      case 'custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <FaCheckDouble className="mr-2" /> Mark All Read
          </button>
          <button
            onClick={toggleSettingsModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center"
          >
            <FaCog className="mr-2" /> Settings
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-full ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filterType === 'whale_movement' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilterType('whale_movement')}
          >
            Whale Movements
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filterType === 'price_change' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilterType('price_change')}
          >
            Price Changes
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filterType === 'volume_spike' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilterType('volume_spike')}
          >
            Volume Spikes
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filterType === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilterType('custom')}
          >
            Custom
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaBell className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No alerts to display</h3>
          <p className="text-gray-500">
            {filterType === 'all'
              ? 'You have no alerts at the moment. We'll notify you when something important happens.'
              : `You have no ${filterType.replace('_', ' ')} alerts at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow-md p-4 flex items-start ${
                !alert.read ? 'border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getAlertTypeColor(alert.type)}`}>
                    {alert.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.tokenSymbol && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {alert.tokenSymbol}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                <p className="text-gray-600 mb-2">{alert.description}</p>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
              {!alert.read && (
                <button
                  onClick={() => handleMarkAsRead(alert.id)}
                  className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  title="Mark as read"
                >
                  <FaCheck />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showSettings && <AlertSettingsModal onClose={toggleSettingsModal} />}
    </div>
  );
};

export default Alerts; 