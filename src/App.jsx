import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPreload } from './states/authUser/slice.js';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NewThreadPage from './pages/NewThreadPage.jsx';
import LeaderboardsPage from './pages/LeaderboardsPage.jsx';

function Protected({ children }) {
  const { user } = useSelector((state) => state.authUser);
  const isPreload = useSelector((state) => state.isPreload);
  if (isPreload) {
    return null;
  }
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const dispatch = useDispatch();
  const isPreload = useSelector((state) => state.isPreload);

  useEffect(() => {
    dispatch(asyncPreload());
  }, [dispatch]);

  if (isPreload) {
    return <p className="splash">Memuat aplikasi…</p>;
  }

  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:id" element={<DetailPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/new" element={<Protected><NewThreadPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
