import React from "react";

function SortFeature({ sortFunc, categories }) {
  const handleSubmit = (e) => {
    const value = e.target.value;
    sortFunc(value);
  };

  return (
    <div className="sort-feature">
      <select
        className="m-6 px-4 py-2 bg-[#393E46] font-semibold tracking-wider"
        onChange={handleSubmit}
        aria-label="Filter by category"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortFeature;
