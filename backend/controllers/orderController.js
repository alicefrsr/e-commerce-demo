import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
// import Product from '../models/ProductModel.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res, next) => {
  // res.send('add order items');
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map(x => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
    console.log(createdOrder);
  }
});

// @desc Get logged in user order
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res, next) => {
  // res.send('get my orders');
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res, next) => {
  // res.send('get order by Id');
  // const order = await Order.findById(req.params.id);
  // we want to add user name and email not stored in Order collection:
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  // res.send('update order to paid');
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      // email: req.body.payer.email_address, // causes app to crash // DB Error: getaddrinfo ENOTFOUND
      email_address: req.body.email,
    };
    const updatedOrder = await order.save();

    // // here add code to update countInStock after a successful purchase
    // for (const index in updatedOrder.orderItems) {
    //   const item = updatedOrder.orderItems[index];
    //   //console.log("Item - ", item);
    //   const product = await Product.findById(item.product);
    //   //console.log("Product - ", product);
    //   product.countInStock -= item.qty;
    //   //console.log("updatedQty - ", product.countInStock);
    //   product.save();
    // }
    // // OverwriteModelError: Cannot overwrite `Product` model once compiled.

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private / Admin
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  res.send('update order to delivered');
});

// @desc Get all orders
// @route GET /api/orders
// @access Private / Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
  res.send('get all orders');
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getAllOrders };
