import { WhaleActivity } from '../redux/slices/whaleSlice'

interface WhaleActivityCardProps {
  activity: WhaleActivity
}

const WhaleActivityCard = ({ activity }: WhaleActivityCardProps) => {
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'bg-green-900 text-green-300'
      case 'swap':
        return 'bg-blue-900 text-blue-300'
      case 'liquidity':
        return 'bg-purple-900 text-purple-300'
      case 'mint':
        return 'bg-yellow-900 text-yellow-300'
      default:
        return 'bg-slate-900 text-slate-300'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'transfer':
        return '转账'
      case 'swap':
        return '兑换'
      case 'liquidity':
        return '流动性'
      case 'mint':
        return '铸造'
      default:
        return type
    }
  }

  return (
    <div className="p-3 bg-slate-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="min-w-[80px]">
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeStyle(activity.type)}`}
          >
            {getTypeLabel(activity.type)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="font-medium">{activity.tokenSymbol}</div>
            <div className="font-bold">${activity.amount.toLocaleString()}</div>
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <div className="text-slate-400 truncate max-w-[200px]">
              {activity.address.substring(0, 6)}...{activity.address.substring(activity.address.length - 4)}
            </div>
            <div className="text-slate-400">
              {new Date(activity.timestamp).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhaleActivityCard 