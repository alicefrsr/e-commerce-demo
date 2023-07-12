import { useState } from 'react'; // to have qty in component state
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
// import { useEffect, useState } from 'react'; // no need now - redux
// import axios from 'axios'; // no need now - redux
import { useGetProductDetailsQuery } from '../slices/productsApiSlice'; // redux
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  // const [product, setProduct] = useState([]); // no need now - redux
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1); // click on Add to cart -> adds 1 by default

  // useEffect(() => {    // no need now - redux
  //   const fetchProduct = async () => {
  //     const { data } = await axios.get(`/api/products/${productId}`);
  //     setProduct(data);
  //   };
  //   fetchProduct();
  // }, [productId]);
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const AddToCartHandler = () => {
    // call the AddToCart action created in cartSlice
    // --> useDispatch (can't call it directly), we have to 'dispatch' an action
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };
  return (
    <>
      <Link
        className='btn btn-light my-3'
        to='/'>
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
            />
          </Col>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong> ${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>{product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity in cart:</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={e => setQty(Number(e.target.value))}>
                          {[...Array(product.countInStock).keys()].map(x => (
                            <option
                              key={x}
                              value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                    onClick={AddToCartHandler}>
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
