import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../services/api';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

const PeriodButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const Analytics = () => {
  const [period, setPeriod] = useState('weekly');
  const [reportData, setReportData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  // Fetch static analytics (browsers, devices, OS, pages, peak hours, bounce rate)
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/analytics');
        setAnalytics(res.data.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Fetch report when period changes
  useEffect(() => {
    const fetchReport = async () => {
      setReportLoading(true);
      try {
        const res = await api.get(`/analytics/reports/${period}`);
        setReportData(res.data.data.report);
      } catch {
        toast.error('Failed to load report');
      } finally {
        setReportLoading(false);
      }
    };
    fetchReport();
  }, [period]);

  if (loading) return <LoadingSpinner fullScreen />;

  const totalVisitors = reportData.reduce((sum, d) => sum + d.visitors, 0);
  const avgVisitors = reportData.length > 0 ? Math.round(totalVisitors / reportData.length) : 0;
  const maxDay = reportData.reduce((max, d) => (d.visitors > max.visitors ? d : max), { visitors: 0 });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Period Selector + Summary */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Visitor Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a time period to view trends</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
              <PeriodButton
                key={p}
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                active={period === p}
                onClick={() => setPeriod(p)}
              />
            ))}
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center py-4 rounded-xl bg-gray-50 dark:bg-white/3">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVisitors.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Visitors</p>
          </div>
          <div className="text-center py-4 rounded-xl bg-gray-50 dark:bg-white/3">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgVisitors.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg per Period</p>
          </div>
          <div className="text-center py-4 rounded-xl bg-gray-50 dark:bg-white/3">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{maxDay.visitors}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Peak: {maxDay.label || '—'}</p>
          </div>
        </div>

        {/* Main Report Chart */}
        {reportLoading ? (
          <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={reportData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#a5b4fc' }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2.5} fill="url(#reportGrad)" dot={{ fill: '#6366f1', r: 3 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* OS Breakdown */}
        <ChartCard title="Operating System" subtitle="Top OS platforms">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.osSystems || []} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#a5b4fc' }}
              />
              <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Pages */}
        <ChartCard title="Top Pages" subtitle="Most visited URLs">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.topPages || []} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis dataKey="page" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#a5b4fc' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Browser Pie */}
        <ChartCard title="Browser Distribution" subtitle="Share by browser">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analytics?.browsers || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                {(analytics?.browsers || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bounce Rate card */}
        <ChartCard title="Bounce Rate" subtitle="Single-page session percentage">
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray={`${analytics?.bounceRate || 0}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics?.bounceRate || 0}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics?.bounceRate < 40
                  ? '✅ Excellent engagement'
                  : analytics?.bounceRate < 60
                  ? '⚠️ Average engagement'
                  : '🔴 High bounce rate'}
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
