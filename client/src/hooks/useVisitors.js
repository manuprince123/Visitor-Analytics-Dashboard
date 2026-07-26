import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for paginated, filterable visitor list.
 */
const useVisitors = (initialFilters = {}) => {
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: 20, totalPages: 1,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    browser: '',
    device: '',
    os: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    order: 'desc',
    ...initialFilters,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      // Build query params — exclude empty values
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null)
      );
      const res = await api.get('/visitors', { params });
      setVisitors(res.data.data);
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 on filter change (except page itself)
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      search: '',
      browser: '',
      device: '',
      os: '',
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  return {
    visitors,
    pagination,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    refetch: fetchVisitors,
  };
};

export default useVisitors;
