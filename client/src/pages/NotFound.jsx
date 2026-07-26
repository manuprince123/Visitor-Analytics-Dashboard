import { Link } from 'react-router-dom';
import { MdHome, MdArrowBack } from 'react-icons/md';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4">
    <div className="text-center">
      <div className="text-8xl font-black gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 btn-secondary">
          <MdArrowBack className="text-base" />
          Go Back
        </button>
        <Link to="/" className="flex items-center gap-2 btn-primary">
          <MdHome className="text-base" />
          Home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
