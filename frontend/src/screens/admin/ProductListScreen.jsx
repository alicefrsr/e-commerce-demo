import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import { toast } from 'react-toastify';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  // before pagination
  // const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  // for pagination: data instead of product, and pass in pageNumber coming from the url
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const createProductHandler = async () => {
    // not creating a form, just adding some sample data admin can edit
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct(); // no need to pass anything in bc gets added in the controller createProduct
        refetch();
        toast.success('New sample product created. Please edit fields with product information.');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const deleteProductHandler = async id => {
    // console.log('product removed:', id);
    if (window.confirm('This will permmanently delete this product from the database. Are you sure you want to proceed? ')) {
      try {
        await deleteProduct(id);
        refetch(); // brought in from the query (useGetProductsQuery)
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button
            className='btn-sm m-3'
            onClick={createProductHandler}>
            <FaEdit />
            Add Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>IN STOCK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.countInStock ? product.countInStock : <FaTimes style={{ color: 'red' }} />}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button
                        variant='light'
                        className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm mx-2'
                      onClick={() => deleteProductHandler(product._id)}>
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
