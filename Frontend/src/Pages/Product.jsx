import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import Form from "../Components/Form";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSingleProductQuery,
} from "../Redux/ApiSlice.js";
import { useToast } from "@chakra-ui/react";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { data, isLoading, isError, error } = useGetSingleProductQuery(id);
  const [deleteProduct] = useDeleteProductMutation(id);

  const controlFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteProduct(id).unwrap();
      toast({
        title: "Product deleted successfully.",
        description: "We've deleted your Product for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error while deleting product.",
        description: "Failed to delete the product",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen  bg-[#262627] text-white items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen  bg-[#262627] text-white items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          {error.status} : {error.error}
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen  bg-[#262627] text-white items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          Product not found with requested ID
        </h1>
      </div>
    );
  }

  const { category, material, name, price, status, image } = data;
  const { name: categoryName } = category;
  const { name: materialName } = material;
  const { image: imageurl } = image || {};

  return (
    <div className="w-[80vw]  lg:w-fit mx-auto p-4">
      {isFormVisible && (
        <Form
          data={data}
          controlFormVisibility={controlFormVisibility}
          isFormVisible={isFormVisible}
        />
      )}
      <div
        className={`flex items-center  justify-end m-2 ${
          isFormVisible ? "blur-md" : "blur-none"
        }`}
      >
        <button
          className="bg-blue-400 px-4 py-2 m-4 tracking-wider font-semibold"
          onClick={() => controlFormVisibility()}
        >
          Edit
        </button>
        <button
          className="bg-red-400 px-4 py-2 m-4 tracking-wider font-semibold"
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      </div>
      <div
        className={`flex w-fit  ${
          isFormVisible ? "blur-md" : "blur-none"
        } bg-[#393E46] md:p-0 mx-auto rounded-lg shadow-lg flex-col items-start justify-around md:flex-row md:items-center`}
      >
        <div className="relative">
          <img
            src={imageurl || null}
            alt={name}
            className="w-[20rem] h-[20rem] object-fill rounded-b-none md:rounded-l-md"
          />
          <p
            className={`w-fit my-4 flex absolute top-0 right-0 rounded-l-xl items-center justify-center
              ${status === "Discontinued" ? "bg-red-300 text-red-600" : ""}
              ${status === "Available" ? "text-green-600 bg-green-300" : ""}
              ${
                status === "Out of Stock" ? "bg-gray-500 text-gray-100" : ""
              } px-4 py-2`}
          >
            {status}
          </p>
        </div>
        <div className="p-4">
          <h1 className="text-3xl font-semibold tracking-wide">{name}</h1>
          <p className="text-gray-300 font-semibold text-xl font mt-2">
            {categoryName}
          </p>
          <p className="text-gray-300 font-semibold text-xl mt-2">
            Material: {materialName}
          </p>

          <p className="mt-2 text-2xl font-semibold">${price}</p>
        </div>
      </div>
    </div>
  );
}

export default Product;
