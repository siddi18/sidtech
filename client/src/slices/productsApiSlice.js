import { apiSlice } from "./apiSlice";
import { BACKEND_URL, PRODUCTS_URL } from "../constants.js";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({keyword, pageNumber}) => ({
        url: 'http://localhost:5000/api/products',
        params: {keyword, pageNumber}
      }),
      keepUnusedDataFor: 5, // Optional: Cache data for 5 minutes
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `http://localhost:5000/api/products/${productId}`,
      }),
      keepUnusedDataFor: 5, // Optional: Cache data for 5 minutes
    }),
    createProduct: builder.mutation({
      query: id => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: id,
      }),
      keepUnusedDataFor: 5, // Optional: Cache data for 5 minutes
    }),
    updateProduct: builder.mutation({
      query: product => ({
        url: `${PRODUCTS_URL}/${product.productId}`,
        method: "PUT",
        body: product,
      }),
      keepUnusedDataFor: 5, // Optional: Cache data for 5 minutes
    }),
    uploadFileHandler: builder.mutation({
      query: data => ({
        url: `${BACKEND_URL}/api/upload`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE'
      }),
      keepUnusedDataFor: 5, // Optional: Cache data for 5 minutes
    }),
    createReview: builder.mutation({
      query: data => ({
        url: `${PRODUCTS_URL}/${data.productId}/review`,
        method: 'POST',
        body: data
      })
    })
  }),
});

export const { useGetProductsQuery,
   useGetProductDetailsQuery,
    useCreateProductMutation,
     useUpdateProductMutation,
      useUploadFileHandlerMutation, 
      useDeleteProductMutation,
     useCreateReviewMutation} = productsApiSlice;
