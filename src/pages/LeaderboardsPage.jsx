import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPopulateLeaderboards } from '../states/leaderboards/slice.js';

function LeaderboardsPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(asyncPopulateLeaderboards());
  }, [dispatch]);

  return (
    <section>
      <h1>Leaderboard</h1>
      <div className="list">
        {leaderboards.map((entry) => (
          <div key={entry.user.id} className="card leader-row">
            <img src={entry.user.avatar} alt={entry.user.name} className="avatar" />
            <div>
              <strong>{entry.user.name}</strong>
              <p className="muted">{entry.user.email}</p>
            </div>
            <span className="score">{entry.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LeaderboardsPage;
