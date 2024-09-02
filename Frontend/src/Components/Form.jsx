import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../Redux/ApiSlice";
import { useToast } from "@chakra-ui/react";

const formSchema = z.object({
  status: z.enum(["Available", "Out of Stock", "Discontinued"], {
    message: "Please provide status",
  }),
  name: z.string().min(3, "Name is required"),
  price: z.number().min(1, "Price is required"),
  categoryData: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
  materialData: z.object({
    name: z.string().min(1, "Material name is required"),
  }),
  image: z.instanceof(FileList).optional(),
});

function Form({ isFormVisible, controlFormVisibility, data }) {
  const { category, material, name, price, status, image, _id } = data || {};
  const { name: categoryName } = category || {};
  const { name: materialName } = material || {};
  const { image: imageurl } = image || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: status || "Available",
      name: name || "",
      price: price || 0,
      categoryData: {
        name: categoryName || "",
      },
      materialData: {
        name: materialName || "",
      },
      image: {
        image: imageurl,
      },
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [addProduct, { isLoading: isAddLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();
  const toast = useToast();

  const onFormSubmit = async (formData) => {
    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData[key][0]) {
        submitData.append("image", formData[key][0]);
      } else if (typeof formData[key] === "object") {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    try {
      if (_id) {
        await updateProduct({ id: _id, data: submitData }).unwrap();
        toast({
          title: "Product edited successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        await addProduct(submitData).unwrap();
        reset();
        toast({
          title: "Product created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      controlFormVisibility(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.data?.message || "Failed to process product",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={`p-4 m-4 z-50 absolute top-8 left-8 bg-[#DDDDDD] text-black w-fit ${
          isFormVisible === "true" ? "blur-none" : ""
        } `}
      >
        {/* status */}
        <div className="mb-2">
          <label className="label">Status</label>
          <select
            {...register("status")}
            className="w-fit px-3 py-2 border rounded-md"
          >
            <option value=""></option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
          {errors?.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* name */}
        <div className="mb-2">
          <label className="label">Name</label>
          <input {...register("name")} className="input" />
          {errors?.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* category */}
        <div className="mb-2">
          <label className="label">Category</label>
          <input {...register("categoryData.name")} className="input" />
          {errors.categoryData?.name && (
            <p className="text-red-500">{errors.categoryData.name.message}</p>
          )}
        </div>

        {/* material */}
        <div className="mb-2">
          <label className="label">Material</label>
          <input {...register("materialData.name")} className="input" />
          {errors.materialData?.name && (
            <p className="text-red-500">{errors.materialData.name.message}</p>
          )}
        </div>
        {/* price */}
        <div className="mb-2">
          <label className="label">Price</label>
          <input
            type="number"
            step="0.01" // Allows floating-point numbers
            {...register("price", { valueAsNumber: true })} // Ensures value is treated as a number
            className="input"
          />
          {errors?.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* image */}
        {/* image */}
        <div className="mb-2">
          <label className="label">Image</label>

          {/* Display existing image if available */}
          {imageurl && (
            <div className="mb-2">
              <img
                src={imageurl}
                alt="Current"
                className="h-20 w-20 object-cover"
              />
              <p className="text-sm">Current Image</p>
            </div>
          )}

          <input
            name="image"
            type="file"
            {...register("image")}
            className="input"
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}
        </div>

        {/* ... form actions ... */}
        <div className="form-actions">
          <button
            onClick={() => controlFormVisibility(false)}
            className="bg-red-400 px-4 py-2 m-4 tracking-wider font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-400 px-4 py-2 m-4 tracking-wider font-semibold"
          >
            {isAddLoading || isUpdateLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
