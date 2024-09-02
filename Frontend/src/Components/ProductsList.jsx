import React, { useState, useEffect, useCallback } from "react";
import { useGetProductsWithPriceRangeQuery } from "../Redux/ApiSlice";
import ProductCard from "./ProductCard";
import SortFeature from "./SortFeature";
import PriceRange from "./PriceRange";
import { useToast } from "@chakra-ui/react";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [totalCategories, setTotalCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const toast = useToast();

  const { data, isError, isLoading, error } =
    useGetProductsWithPriceRangeQuery();
  const { priceRanges, products: allProducts } = data || {};

  useEffect(() => {
    if (allProducts) {
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Add "All" option at the beginning of the categories list
      const categories = [
        "All",
        ...new Set(allProducts.map((product) => product.category.name)),
      ];
      setTotalCategories(categories);
    }
  }, [allProducts]);

  const filterProductsByCategory = useCallback(
    (category) => {
      const filtered =
        category === "All"
          ? products
          : products.filter((product) => product.category.name === category);
      setFilteredProducts(filtered);
    },
    [products]
  );

  const filterProductsWithNoMedia = useCallback(() => {
    const filtered = products.filter((product) => product.image == null);
    setFilteredProducts(filtered);

    console.log(filtered);
    if (filtered.length === 0) {
      toast({
        title: "No Products found without product image.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }, [products]);

  const sortProductsByPrice = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
    console.log(sorted);
    setFilteredProducts(sorted);
  };

  if (isLoading) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          {error.status} : {error.error}
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          Create At Least One Product
        </h1>
      </div>
    );
  }

  return (
    <div className="productlist min-h-screen">
      <div className="flex items-center justify-center flex-wrap pt-20 md:pt-0">
        <SortFeature
          categories={totalCategories}
          sortFunc={filterProductsByCategory}
        />
        <button
          className="px-4 py-2 bg-orange-400"
          onClick={sortProductsByPrice}
        >
          Sort by Price
        </button>
        <button
          className="px-4 py-2 bg-blue-400"
          onClick={filterProductsWithNoMedia}
        >
          Products with No Media
        </button>
      </div>

      <PriceRange priceRanges={priceRanges} />
      <div className="flex items-center justify-center flex-wrap">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
