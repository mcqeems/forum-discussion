function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="chips">
      <button
        type="button"
        className={selected === '' ? 'chip chip-active' : 'chip'}
        onClick={() => onSelect('')}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={selected === category ? 'chip chip-active' : 'chip'}
          onClick={() => onSelect(selected === category ? '' : category)}
        >
          #{category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
