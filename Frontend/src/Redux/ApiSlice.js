import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const URL = "http://localhost:8000/";
// import.meta.env.VITE_API_URL ||
export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL}`,
  }),
  endpoints: (builder) => ({
    getProductsWithPriceRange: builder.query({
      query: () => "api/products",
      providesTags: ["product"],
    }),
    getSingleProduct: builder.query({
      query: (id) => `api/products/${id}`,
      providesTags: ["product"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "api/Products",
        method: "POST",
        body: newProduct,
        formData: true,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => {
        const isFormData = data instanceof FormData;
        return {
          url: `api/products/${id}`,
          method: "PATCH",
          body: data,
          formData: isFormData,
          // Only set headers if it's not FormData
          headers: isFormData
            ? undefined
            : {
                "Content-Type": "application/json",
              },
        };
      },
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/products/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsWithPriceRangeQuery,
  useGetSingleProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;
