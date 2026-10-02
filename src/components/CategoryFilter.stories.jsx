import { useState } from 'react';
import CategoryFilter from './CategoryFilter.jsx';

export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
};

function InteractiveFilter({ initialSelected = '' }) {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <CategoryFilter
      categories={['react', 'redux', 'dicoding']}
      selected={selected}
      onSelect={setSelected}
    />
  );
}

export function Default() {
  return <InteractiveFilter />;
}

export function WithSelected() {
  return <InteractiveFilter initialSelected="react" />;
}
