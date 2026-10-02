import { useSelector } from 'react-redux';

function LoadingBar() {
  const loading = useSelector((state) => state.loadingBar);
  if (loading === 0) {
    return null;
  }
  return (
    <div className="loading-bar" role="progressbar" aria-label="memuat data">
      <div className="loading-bar-fill" />
    </div>
  );
}

export default LoadingBar;
