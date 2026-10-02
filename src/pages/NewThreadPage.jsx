import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncCreateThread } from '../states/threads/slice.js';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [body, setBody] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    const thread = await dispatch(asyncCreateThread({ title, body, category }));
    if (thread?.id) {
      navigate(`/threads/${thread.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <section className="narrow">
      <h1>Buat Thread</h1>
      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Kategori (mis. general)"
          required
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Isi thread…"
          rows={6}
          required
        />
        <button type="submit" className="btn btn-primary">Buat</button>
      </form>
    </section>
  );
}

export default NewThreadPage;
