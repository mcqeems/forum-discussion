import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncRegister } from '../states/authUser/slice.js';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.authUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(asyncRegister({ name, email, password }));
      navigate('/login');
    } catch (_error) {
      // rendered inline via slice
    }
  };

  return (
    <section className="narrow">
      <h1>Daftar</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama"
          required
        />
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
          placeholder="Password (min. 6)"
          minLength={6}
          required
        />
        <button type="submit" className="btn btn-primary">Daftar</button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </section>
  );
}

export default RegisterPage;
