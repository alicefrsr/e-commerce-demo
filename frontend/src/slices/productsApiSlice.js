import { PRODUCTS_URL } from '../constants';
import { UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // to use in HomeScreen, admin ProductListScreen
    // before pagination and search
    // getProducts: builder.query({
    //   query: () => ({
    //     url: PRODUCTS_URL,
    //   }),
    //   providesTags: ['Products'], // otherwise we may have to refresh the page
    //   // ['Product'] and ['Products'] both work? what are we refering to?

    //   keepUnusedDataFor: 5, // value in seconds
    // }),
    // pagination, before search:
    // getProducts: builder.query({
    //   query: ({ pageNumber }) => ({
    //     url: PRODUCTS_URL,
    //     params: {
    //       pageNumber,
    //     },
    //   }),
    //   providesTags: ['Products'], // otherwise we may have to refresh the page
    //   // ['Product'] and ['Products'] both work? what are we refering to?

    //   keepUnusedDataFor: 5, // value in seconds
    // }),

    // pagination and search
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: {
          pageNumber,
          keyword,
        },
      }),
      providesTags: ['Products'], // otherwise we may have to refresh the page
      // ['Product'] and ['Products'] both work? what are we refering to?

      keepUnusedDataFor: 5, // value in seconds
    }),

    // to use in ProductScreen, admin ProductEditScreen
    getProductDetails: builder.query({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // to use in admin ProductListScreen
    createProduct: builder.mutation({
      query: () => ({
        // not passing anything in because it's just sample data until it's been edited
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Product'], // will stop it from being cached so we have fresh data
    }),

    // to use in admin ProductEditScreen
    updateProduct: builder.mutation({
      query: data => ({
        url: `${PRODUCTS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'], // clear cache // ['Product'] and ['Products'] both work?
    }),
    // to use in admin ProductEditScreen
    uploadProductImage: builder.mutation({
      query: data => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),

    // to use in admin ProductListScreen
    deleteProduct: builder.mutation({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
    // to use in ProductScreen
    createReview: builder.mutation({
      query: data => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'], // will stop it from being cached so we have fresh data
    }),

    // to use in ProductCarousel component
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
