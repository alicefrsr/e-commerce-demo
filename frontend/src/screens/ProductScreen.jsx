import { useState } from 'react'; // to have qty in component state
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { toast } from 'react-toastify';
// import { useEffect, useState } from 'react'; // no need now - redux
// import axios from 'axios'; // no need now - redux
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'; // redux
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  // const [product, setProduct] = useState([]); // no need now - redux
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1); // click on Add to cart -> adds 1 by default
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  // console.log(product);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const { userInfo } = useSelector(state => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async e => {
    e.preventDefault();
    console.log('review submitted');
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted');
      console.log(rating);
      // reset form fields
      setRating(0);
      setComment('');
      // console.log(product.reviews);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.log(rating);
      console.log(typeof rating); // Number
    }
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
        <>
          <Meta title={product.name} />
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
                    text={`${product.numReviews} ${product.numReviews <= 1 ? ' review' : ' reviews'}`}
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
                      onClick={addToCartHandler}>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {loadingProductReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group
                        controlId='rating'
                        className='my-2'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}>
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group
                        controlId='comment'
                        className='my-2'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={e => setComment(e.target.value)}></Form.Control>
                      </Form.Group>
                      <Button
                        variant='primary'
                        disabled={loadingProductReview}
                        type='submit'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
