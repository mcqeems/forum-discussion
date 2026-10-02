import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLogout } from '../states/authUser/slice.js';
import LoadingBar from './LoadingBar.jsx';

function Header() {
  const { user } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(asyncLogout());
    navigate('/');
  };

  return (
    <header className="header">
      <LoadingBar />
      <div className="header-inner">
        <Link to="/" className="brand">Forum Diskusi</Link>
        <nav className="nav">
          <Link to="/">Threads</Link>
          <Link to="/leaderboards">Leaderboard</Link>
          {user && <Link to="/new">+ Thread</Link>}
        </nav>
        <div className="auth-area">
          {user ? (
            <>
              <img src={user.avatar} alt={user.name} className="avatar-sm" />
              <span className="username">{user.name}</span>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>Keluar</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Masuk</Link>
              <Link to="/register" className="btn btn-primary">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
