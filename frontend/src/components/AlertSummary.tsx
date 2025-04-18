import { Alert } from '../redux/slices/alertSlice'
import { useAppDispatch } from '../redux/hooks'
import { markAlertAsRead } from '../redux/slices/alertSlice'
import { RiAlarmWarningLine, RiExchangeDollarLine, RiLineChartLine, RiSettings5Line } from 'react-icons/ri'

interface AlertSummaryProps {
  alert: Alert
}

const AlertSummary = ({ alert }: AlertSummaryProps) => {
  const dispatch = useAppDispatch()

  const handleMarkAsRead = () => {
    if (!alert.read) {
      dispatch(markAlertAsRead(alert.id))
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'whale_movement':
        return <RiExchangeDollarLine size={20} className="text-blue-400" />
      case 'price_change':
        return <RiLineChartLine size={20} className="text-green-400" />
      case 'volume_spike':
        return <RiLineChartLine size={20} className="text-purple-400" />
      case 'custom':
        return <RiSettings5Line size={20} className="text-orange-400" />
      default:
        return <RiAlarmWarningLine size={20} className="text-red-400" />
    }
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-900 text-red-300'
      case 'medium':
        return 'bg-orange-900 text-orange-300'
      case 'low':
        return 'bg-blue-900 text-blue-300'
      default:
        return 'bg-slate-900 text-slate-300'
    }
  }

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        alert.read ? 'bg-slate-800' : 'bg-slate-700'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getAlertIcon(alert.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium truncate">{alert.title}</div>
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded ${getSeverityClass(alert.severity)}`}
            >
              {alert.severity === 'high'
                ? '高'
                : alert.severity === 'medium'
                ? '中'
                : '低'}
            </span>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{alert.description}</p>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <div>{alert.tokenSymbol}</div>
            <div>{new Date(alert.timestamp).toLocaleString()}</div>
          </div>
        </div>
        {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
      </div>
    </div>
  )
}

export default AlertSummary 