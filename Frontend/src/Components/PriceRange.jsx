import React from "react";
import { v4 as uuidv4 } from "uuid";

function PriceRange({ priceRanges }) {
  return (
    <div className=" text-center my-4">
      {priceRanges.map(({ priceRange, count }) => {
        const id = uuidv4();
        return (
          <h1 className="tracking-wider text-base font-semibold" key={id}>
            {count} Products available for price range ${priceRange}
          </h1>
        );
      })}
    </div>
  );
}

export default PriceRange;
