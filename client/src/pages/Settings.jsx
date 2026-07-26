import { useState } from 'react';
import { MdPerson, MdLock, MdLogout, MdSave, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Section = ({ title, subtitle, children }) => (
  <div className="card p-6">
    <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { admin, logout, updateAdmin } = useAuth();
  const navigate = useNavigate();

  // Profile form
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // ─── Profile Update ──────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/profile', profile);
      updateAdmin(res.data.admin);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Password Change ─────────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const PasswordInput = ({ id, label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field pl-10 pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          {show ? <MdVisibilityOff /> : <MdVisibility />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      {/* Profile Section */}
      <Section title="Profile Information" subtitle="Update your admin name and email address">
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="admin-name">
              Full Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="admin-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="admin-email">
              Email Address
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="admin-email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                className="input-field pl-10"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="flex items-center gap-2 btn-primary disabled:opacity-60"
          >
            {profileLoading ? <LoadingSpinner size="sm" /> : <MdSave className="text-base" />}
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Section>

      {/* Password Section */}
      <Section title="Change Password" subtitle="Ensure your account uses a strong password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PasswordInput
            id="current-password"
            label="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
            placeholder="Enter current password"
          />
          <PasswordInput
            id="new-password"
            label="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
            placeholder="Min. 6 characters"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="confirm-password"
                type={showNew ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
                className="input-field pl-10"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="flex items-center gap-2 btn-primary disabled:opacity-60"
          >
            {passwordLoading ? <LoadingSpinner size="sm" /> : <MdLock className="text-base" />}
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </Section>

      {/* Account Actions */}
      <Section title="Account Actions" subtitle="Manage your session">
        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Sign Out</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Log out of the admin dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 btn-danger text-sm"
          >
            <MdLogout className="text-base" />
            Logout
          </button>
        </div>

        {/* Admin info */}
        <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium uppercase tracking-wider">Session Info</p>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 dark:text-gray-500 mr-2">Name:</span>
              {admin?.name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-400 dark:text-gray-500 mr-2">Email:</span>
              {admin?.email}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Settings;
