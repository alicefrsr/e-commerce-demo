import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';

import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const { id: productId } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  //   console.log(product);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async e => {
    e.preventDefault();
    const updatedProduct = {
      _id: productId, // productId from the url (slice: url: PRODUCTS_URL/data._id)
      // we could have just productId and in the slice: url: PRODUCTS_URL/data.productId // same
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      console.log(updatedProduct);
      toast.success('Product updated');
      navigate('/admin/productlist');
    }
  };

  // this uploads the image but doesn't save it to the DB  --> updateProduct does
  const uploadFileHandler = async e => {
    // create a form data object

    console.log(e.target.files[0]);
    const formData = new FormData();

    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      // set the component state of the image url
      setImage(res.image); // because we sent the image path back in a prop called image
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link
        to='/admin/productlist'
        className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group
              controlId='name'
              className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={e => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='price'
              className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={e => setPrice(e.target.value)}></Form.Control>
            </Form.Group>

            {/* image input */}
            <Form.Group
              controlId='image'
              className='my-2'>
              <Form.Label>Image</Form.Label>
              {/* this is for the url: */}
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image} // NOT the image itself but the imageUrl from our component state
                onChange={e => setImage(e.target.value)}></Form.Control>
              {/* this is for the image file: */}
              <Form.Control
                type='file'
                label='Choose file'
                onChange={uploadFileHandler}></Form.Control>

              {/* <Form.File 
                id='image-file' // other option instead of Form.Control?
                label='Choose file'
                onChange={uploadProductImage}>
              </Form.File> */}
            </Form.Group>
            {loadingUpload && <Loader />}

            <Form.Group
              controlId='brand'
              className='my-2'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={e => setBrand(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='category'
              className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter number of products in stock'
                value={category}
                onChange={e => setCategory(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='countInStock'
              className='my-2'>
              <Form.Label>In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter number of products in stock'
                value={countInStock}
                onChange={e => setCountInStock(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group
              controlId='description'
              className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter number of products in stock'
                value={description}
                onChange={e => setDescription(e.target.value)}></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='my-2'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
