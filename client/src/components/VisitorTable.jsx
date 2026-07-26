import { useState } from 'react';
import {
  MdSearch,
  MdDelete,
  MdVisibility,
  MdArrowUpward,
  MdArrowDownward,
  MdUnfoldMore,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DEVICE_BADGE = {
  Desktop: 'badge-blue',
  Mobile: 'badge-green',
  Tablet: 'badge-purple',
  Unknown: 'badge-orange',
};

const SortIcon = ({ field, sortBy, order }) => {
  if (sortBy !== field) return <MdUnfoldMore className="text-gray-300" />;
  return order === 'asc' ? (
    <MdArrowUpward className="text-primary-500" />
  ) : (
    <MdArrowDownward className="text-primary-500" />
  );
};

const VisitorTable = ({ visitors, pagination, filters, updateFilter, loading, refetch, onView }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this visitor record?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/visitor/${id}`);
      toast.success('Record deleted');
      refetch();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc');
    } else {
      updateFilter('sortBy', field);
      updateFilter('order', 'desc');
    }
  };

  const columns = [
    { key: 'visitorId', label: 'Visitor ID', sortable: false },
    { key: 'visitDate', label: 'Date', sortable: true },
    { key: 'visitTime', label: 'Time', sortable: false },
    { key: 'browser', label: 'Browser', sortable: true },
    { key: 'device', label: 'Device', sortable: true },
    { key: 'os', label: 'OS', sortable: true },
    { key: 'page', label: 'Page', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="card overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none' : ''
                  }`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon field={col.key} sortBy={filters.sortBy} order={filters.order} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : visitors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400 dark:text-gray-500">
                  <MdSearch className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No visitor records found</p>
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <tr
                  key={visitor._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {visitor.visitorId?.slice(0, 8)}…
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {visitor.visitDate}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {visitor.visitTime}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {visitor.browser}
                  </td>
                  <td className="px-4 py-3">
                    <span className={DEVICE_BADGE[visitor.device] || 'badge-orange'}>
                      {visitor.device}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{visitor.os}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px] block">
                      {visitor.page}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onView(visitor)}
                        className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                        title="View details"
                      >
                        <MdVisibility className="text-base" />
                      </button>
                      <button
                        onClick={() => handleDelete(visitor._id)}
                        disabled={deletingId === visitor._id}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Delete record"
                      >
                        {deletingId === visitor._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <MdDelete className="text-base" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total.toLocaleString()} records
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateFilter('page', pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => updateFilter('page', p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pagination.page === p
                      ? 'bg-primary-600 text-white'
                      : 'btn-secondary'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => updateFilter('page', pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorTable;
