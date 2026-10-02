import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLogin } from '../states/authUser/slice.js';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.authUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(asyncLogin({ email, password }));
      navigate('/');
    } catch (_error) {
      // error already stored in slice and rendered inline
    }
  };

  return (
    <section className="narrow">
      <h1>Masuk</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="btn btn-primary">Masuk</button>
      </form>
      <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
    </section>
  );
}

export default LoginPage;
