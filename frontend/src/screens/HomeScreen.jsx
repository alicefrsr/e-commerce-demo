// import { useEffect, useState } from 'react'; // no need now (redux)
// import axios from 'axios'; // no need now (redux)
import { useGetProductsQuery } from '../slices/productsApiSlice';

import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
// import products from '../products';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
// import Meta from '../components/Meta';

const HomeScreen = () => {
  // const [products, setProducts] = useState([]); // no need for products in our component state
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('/api/products');
  //     setProducts(data);
  //   };

  //   fetchProducts();
  // }, []);

  // const { data: products, isLoading, error } = useGetProductsQuery();
  // pagination and search:
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });
  // data is now an object with products, page, pageSize

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link
          to='/'
          className='btn btn-light my-3'>
          Go back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* <Meta /> */}
          <h1>Latest Products</h1>
          <Row>
            {data.products.map(product => (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
