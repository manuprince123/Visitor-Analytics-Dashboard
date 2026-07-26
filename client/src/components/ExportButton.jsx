import { useState } from 'react';
import { MdFileDownload } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

/**
 * ExportButton — triggers CSV download of visitor data.
 */
const ExportButton = ({ filters = {} }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Request CSV as blob
      const res = await api.get('/visitors/export', {
        params: filters,
        responseType: 'blob',
      });

      // Create downloadable link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `visitors-${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 btn-secondary text-sm disabled:opacity-60"
    >
      {loading ? <LoadingSpinner size="sm" /> : <MdFileDownload className="text-base" />}
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  );
};

export default ExportButton;
