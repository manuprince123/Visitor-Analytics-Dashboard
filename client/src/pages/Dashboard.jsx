import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useState, useEffect } from 'react';
import {
  MdPeople, MdToday, MdDateRange, MdCalendarMonth,
  MdWifiTethering, MdPersonAdd, MdLoop, MdRefresh,
} from 'react-icons/md';
import useDashboard from '../hooks/useDashboard';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

const Dashboard = () => {
  const { stats, loading, error, refetch } = useDashboard();
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const [weekly, monthly, analytics] = await Promise.all([
          api.get('/analytics/reports/weekly'),
          api.get('/analytics/reports/monthly'),
          api.get('/analytics'),
        ]);
        setWeeklyData(weekly.data.data.report);
        setMonthlyData(monthly.data.data.report);
        setBrowsers(analytics.data.data.browsers);
        setDevices(analytics.data.data.devices);
        setPeakHours(analytics.data.data.peakHours);
      } catch {
        toast.error('Failed to load chart data');
      } finally {
        setChartsLoading(false);
      }
    };
    fetchCharts();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">{error}</p>
        <button onClick={refetch} className="btn-primary flex items-center gap-2">
          <MdRefresh /> Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Visitors', value: stats?.totalVisitors, icon: MdPeople, color: 'primary' },
    { title: 'Visitors Today', value: stats?.todayVisitors, icon: MdToday, color: 'green' },
    { title: 'This Week', value: stats?.weekVisitors, icon: MdDateRange, color: 'blue' },
    { title: 'This Month', value: stats?.monthVisitors, icon: MdCalendarMonth, color: 'purple' },
    { title: 'Active Now', value: stats?.activeUsers, icon: MdWifiTethering, color: 'cyan', subtitle: 'Last 15 minutes' },
    { title: 'New Visitors', value: stats?.newVisitors, icon: MdPersonAdd, color: 'orange' },
    { title: 'Returning', value: stats?.returningVisitors, icon: MdLoop, color: 'pink' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly Visitors */}
        <div className="lg:col-span-2">
          <ChartCard title="Weekly Visitors" subtitle="Last 7 days">
            {chartsLoading ? (
              <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#e5e7eb' }}
                    itemStyle={{ color: '#a5b4fc' }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} fill="url(#weekGrad)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Device Breakdown */}
        <ChartCard title="Device Types" subtitle="Desktop / Mobile / Tablet">
          {chartsLoading ? (
            <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {devices.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Monthly Visitors */}
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Visitors" subtitle="Last 30 days">
            {chartsLoading ? (
              <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: '#a5b4fc' }}
                  />
                  <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Browser Usage */}
        <ChartCard title="Browser Usage" subtitle="Top browsers">
          {chartsLoading ? (
            <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={browsers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {browsers.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Peak Traffic Hours */}
      <ChartCard title="Peak Traffic Hours" subtitle="Visitor distribution by hour (24h)">
        {chartsLoading ? (
          <div className="h-48 flex items-center justify-center"><LoadingSpinner /></div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHours} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6b7280' }} interval={1} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#a5b4fc' }}
              />
              <Bar dataKey="visitors" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
};

export default Dashboard;
