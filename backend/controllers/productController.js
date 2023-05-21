const { ProductModel } = require("../models/productModel");

// add new product
const addNewProduct = async (req, res) => {
  let data = req.body;
  try {
    let newProduct = new ProductModel({ ...data, addedBy: req.body.userId });
    await newProduct.save();
    res.status(200).json({ message: "product added", product: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again.", err: err.message });
  }
};

// update product.
const updateProduct = async (req, res) => {
  let data = req.body;
  let userId = req.body.userId;
  let productId = req.params.productId;
  try {
    let isProduct = await ProductModel.findOne({
      _id: productId,
      addedBy: userId,
    });
    if (!isProduct)
      return res.status(404).json({ message: "You can't update the product" });
    let updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: data,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully.",
      newProduct: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server err please try again", err: err.message });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.body.userId;
  try {
    let isProduct = await ProductModel.findOne({
      _id: productId,
      addedBy: userId,
    });
    if (!isProduct)
      return res.status(404).json({ message: "You can't update the product" });
    let deletedProduct = await ProductModel.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

// get product by id
const getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    let product = await ProductModel.findById(productId);
    res.status(200).json({ product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again.", err: err.message });
  }
};

const productsList = async (req, res) => {
  let query = req.query;
  let { _sort, _page = 1 } = query;
  let Limit = 8;

  let Skip = Limit * (_page - 1);

  try {
    let count = await ProductModel.find().countDocuments();
    let totalPages = Math.ceil(count / Limit);
    if (_sort) {
      let products = await ProductModel.find()
        .limit(Limit)
        .skip(Skip)
        .sort({ title: _sort === "asc" ? 1 : -1 });

      res.status(200).json({ products, totalPages });
    } else {
      let products = await ProductModel.find().limit(Limit).skip(Skip);

      res.status(200).json({ products, totalPages });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

const searchProducts = async (req, res) => {
  let query = req.query;
  let { q } = query;
  try {
    let products = await ProductModel.find({
      name: { $regex: q, $options: "i" },
    }).limit(10);

    res.status(200).json({ products });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error please try again!", err: err.message });
  }
};

module.exports = {
  getProductById,
  addNewProduct,
  updateProduct,
  deleteProduct,
  productsList,
  searchProducts,
};