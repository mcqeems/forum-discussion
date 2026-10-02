import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncPopulateThreads } from "../states/threads/slice.js";
import { asyncPopulateUsers } from "../states/users/slice.js";
import ThreadItem from "../components/ThreadItem.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    dispatch(asyncPopulateThreads());
    dispatch(asyncPopulateUsers());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(threads.map((thread) => thread.category))],
    [threads],
  );
  const visible = selected
    ? threads.filter((thread) => thread.category === selected)
    : threads;

  return (
    <section>
      <h1>Daftar Thread</h1>
      <CategoryFilter
        categories={categories}
        selected={selected}
        onSelect={setSelected}
      />
      {visible.length === 0 && <p className="muted">Belum ada thread.</p>}
      <div className="list">
        {visible.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}

export default HomePage;
