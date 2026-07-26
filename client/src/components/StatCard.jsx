/**
 * StatCard — displays a single metric with icon, value, label, and optional trend.
 */
const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, subtitle }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-500/10 dark:bg-primary-500/20',
      icon: 'text-primary-600 dark:text-primary-400',
      trend: 'text-primary-600 dark:text-primary-400',
    },
    green: {
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      icon: 'text-green-600 dark:text-green-400',
      trend: 'text-green-600 dark:text-green-400',
    },
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      icon: 'text-blue-600 dark:text-blue-400',
      trend: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      icon: 'text-purple-600 dark:text-purple-400',
      trend: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-orange-500/10 dark:bg-orange-500/20',
      icon: 'text-orange-600 dark:text-orange-400',
      trend: 'text-orange-600 dark:text-orange-400',
    },
    pink: {
      bg: 'bg-pink-500/10 dark:bg-pink-500/20',
      icon: 'text-pink-600 dark:text-pink-400',
      trend: 'text-pink-600 dark:text-pink-400',
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      icon: 'text-cyan-600 dark:text-cyan-400',
      trend: 'text-cyan-600 dark:text-cyan-400',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value !== undefined && value !== null ? value.toLocaleString() : '—'}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${c.trend}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
              <span className="text-gray-400 dark:text-gray-500 font-normal">vs last week</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 p-3 rounded-2xl ${c.bg}`}>
          {Icon && <Icon className={`h-6 w-6 ${c.icon}`} />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
