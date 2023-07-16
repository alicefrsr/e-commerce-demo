import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';

import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from '../slices/ordersApiSlice';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const OrderScreen = () => {
  // to access order Id so we can pass it into GetOrderDetails query
  const { id: orderId } = useParams();
  // to access order details
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  console.log(order);
  // payment:
  // to access payOrder mutation
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  // to access deliverOrder mutation once admin has updated to delivered
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation(orderId); // NOT passing in (orderId) works too? ...why?
  // to access Paypal reducer
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // to acccess data from paypal res (to get client id)
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();

  // bring in user data // we need it to identify user as admin for the admin button 'delivered'
  const { userInfo } = useSelector(state => state.auth);

  // to load the paypal script:
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      // from paypal doc
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    // actions.order.capture() is what triggers paypal
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Payment successful');
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success('Payment successful');
  }
  function onError(error) {
    toast.error(error.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then(orderId => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch(); // because we want toast message to update to green/delivered
      toast.success('Order delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not delivered</Message>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not paid</Message>}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>Order Summary</ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>

                <Row>
                  <Col>
                    <strong>Total:</strong>
                  </Col>
                  <Col>
                    <strong>${order.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: '10px' }}>
                        Test Pay Order
                      </Button> */}

                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* MARK AS DELIVERED BTN (ADMIN ONLY)  */}
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block'
                    onClick={deliverOrderHandler}>
                    Mark as delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
