import { MdClose, MdComputer, MdPhoneAndroid, MdTablet } from 'react-icons/md';

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-white/5 last:border-0">
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-32 flex-shrink-0 pt-0.5">
      {label}
    </span>
    <span className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">{value || '—'}</span>
  </div>
);

const DeviceIcon = ({ device }) => {
  if (device === 'Mobile') return <MdPhoneAndroid className="text-xl text-green-500" />;
  if (device === 'Tablet') return <MdTablet className="text-xl text-purple-500" />;
  return <MdComputer className="text-xl text-blue-500" />;
};

const VisitorDetailModal = ({ visitor, onClose }) => {
  if (!visitor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg card p-0 overflow-hidden animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <DeviceIcon device={visitor.device} />
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Visitor Details
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {visitor.visitDate} at {visitor.visitTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={visitor.firstVisit ? 'badge-green' : 'badge-blue'}>
              {visitor.firstVisit ? '✨ New Visitor' : '↩️ Returning'}
            </span>
          </div>

          <InfoRow label="Visitor ID" value={visitor.visitorId} />
          <InfoRow label="Session ID" value={visitor.sessionId} />
          <InfoRow label="Browser" value={visitor.browser} />
          <InfoRow label="OS" value={visitor.os} />
          <InfoRow label="Device" value={visitor.device} />
          <InfoRow label="Screen" value={visitor.screenResolution} />
          <InfoRow label="Language" value={visitor.language} />
          <InfoRow label="Timezone" value={visitor.timezone} />
          <InfoRow label="Page" value={visitor.page} />
          <InfoRow label="Referrer" value={visitor.referrer} />
          <InfoRow label="IP Address" value={visitor.ip} />
          <InfoRow label="Country" value={visitor.country} />
          <InfoRow label="Date" value={visitor.visitDate} />
          <InfoRow label="Time" value={visitor.visitTime} />
          <InfoRow label="Last Visit" value={visitor.lastVisit ? new Date(visitor.lastVisit).toLocaleString() : '—'} />
          <InfoRow label="Record ID" value={visitor._id} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-white/5 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetailModal;
