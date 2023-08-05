import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res, next) => {
  //pagination
  const pageSize = 8; // = products per page
  const page = Number(req.query.pageNumber) || 1;
  // const count = await Product.countDocuments();

  //  search
  // regex to match keyword with products even if it's not exactly the same word, $options: 'i' makes it case insensitive
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
  // we want to limit the count to only products matching keyword
  const count = await Product.countDocuments({ ...keyword });

  // getProducts: await Product.find({}) takes in ...keyword
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create a product
// @route POST /api/products
// @access Private / Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const product = new Product({
    user: req.user._id,
    name: 'sample name',
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    description: 'sample desc',
    // reviews: [reviewSchema],
    numReviews: 0,
    price: 0,
    countInStock: 0,
  });

  const newProduct = await product.save();
  res.status(201).json(newProduct);

  // // create method called on the Model:
  // const newProduct = await Product.create(req.body);
  // res.status(201).json(newProduct);
  // // or
  // res.status(201).json({ status: 'success', data: { product: newProduct } });
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private / Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);

    // // or findByIdAndUpdate method called on the Model:
    // const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // runValidators: true
    // }
    // );
    // res.status(200).json(updatedProduct);
    // // or
    // res.status(200).json({ status: 'success', data: { product: updatedProduct } });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Delete product by id
// @route DELETE /api/products/:id
// @access Private / Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create a new product review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    // check if user (req.user._id.toString()) has already reviewed the product
    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts };
