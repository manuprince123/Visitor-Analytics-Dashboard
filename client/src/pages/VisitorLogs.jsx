import { useState } from 'react';
import { MdSearch, MdFilterList, MdRefresh, MdClose } from 'react-icons/md';
import useVisitors from '../hooks/useVisitors';
import VisitorTable from '../components/VisitorTable';
import VisitorDetailModal from '../components/VisitorDetailModal';
import ExportButton from '../components/ExportButton';

const FilterInput = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    {children}
  </div>
);

const VisitorLogs = () => {
  const { visitors, pagination, filters, loading, error, updateFilter, resetFilters, refetch } =
    useVisitors();

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.search || filters.browser || filters.device || filters.os || filters.startDate || filters.endDate;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total.toLocaleString()} total records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton filters={filters} />
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 btn-secondary text-sm ${showFilters ? 'ring-2 ring-primary-500/30' : ''}`}
          >
            <MdFilterList className="text-base" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </button>
          <button
            onClick={refetch}
            className="p-2 btn-secondary"
            title="Refresh"
            aria-label="Refresh data"
          >
            <MdRefresh className="text-base" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="search"
          placeholder="Search by visitor ID, browser, OS, IP, page..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="input-field pl-11"
          id="visitor-search"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <MdClose />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-up">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <FilterInput label="Browser">
              <select
                value={filters.browser}
                onChange={(e) => updateFilter('browser', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">All Browsers</option>
                {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Samsung Browser'].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </FilterInput>

            <FilterInput label="Device">
              <select
                value={filters.device}
                onChange={(e) => updateFilter('device', e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="">All Devices</option>
                {['Desktop', 'Mobile', 'Tablet'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FilterInput>

            <FilterInput label="OS">
              <input
                type="text"
                value={filters.os}
                onChange={(e) => updateFilter('os', e.target.value)}
                placeholder="e.g. Windows, macOS"
                className="input-field text-sm py-2"
              />
            </FilterInput>

            <FilterInput label="From Date">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter('startDate', e.target.value)}
                className="input-field text-sm py-2"
              />
            </FilterInput>

            <FilterInput label="To Date">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter('endDate', e.target.value)}
                className="input-field text-sm py-2"
              />
            </FilterInput>

            <FilterInput label="Per Page">
              <select
                value={filters.limit}
                onChange={(e) => updateFilter('limit', Number(e.target.value))}
                className="input-field text-sm py-2"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n} rows</option>
                ))}
              </select>
            </FilterInput>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex justify-end">
              <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors">
                <MdClose className="text-base" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Visitor Table */}
      {error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-3">{error}</p>
          <button onClick={refetch} className="btn-primary text-sm">Retry</button>
        </div>
      ) : (
        <VisitorTable
          visitors={visitors}
          pagination={pagination}
          filters={filters}
          updateFilter={updateFilter}
          loading={loading}
          refetch={refetch}
          onView={setSelectedVisitor}
        />
      )}

      {/* Detail Modal */}
      {selectedVisitor && (
        <VisitorDetailModal
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
};

export default VisitorLogs;
