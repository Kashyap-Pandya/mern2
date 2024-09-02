import React from "react";
import { NavLink } from "react-router-dom";

function ProductCard({ product }) {
  const { category, material, name, price, status, image, _id } = product;
  const { name: categoryName } = category;
  const { name: materialName } = material;
  const { image: imageurl } = image || {};
  return (
    <div className="productcard w-[15rem] flex flex-col items-start justify-around m-8 shadow-lg">
      <img
        src={imageurl || null}
        className="w-full h-[15rem] rounded-t-lg object-cover"
        alt={`${name} image`}
      />
      <div className="p-4 bg-[#31363F] w-full rounded-b-lg">
        <NavLink to={`/${_id}`}>
          <h1 className="font-semibold text-[1.15rem] my-1 hover:text-[#8681f5]">
            {name}
          </h1>
        </NavLink>
        <p className="text-gray-300 font-semibold my-1 tracking-wider">
          {status}
        </p>
        <p className="font-semibold bg-slate-300 text-black w-fit p-2 rounded-md my-2 tracking-wider">
          {categoryName}
        </p>
        <p className="font-semibold my-1 tracking-wider">
          Material : {materialName}
        </p>
        <p className="font-semibold text-[1.15rem] tracking-wider">${price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
