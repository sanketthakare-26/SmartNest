const Product = require("../models/Product");

// @desc    Get all products (with search, filter, sort, paginate)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      featured, 
      sort, 
      page = 1, 
      limit = 12 
    } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter (match ObjectId or Category slug if populated, let's filter by ID)
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured) {
      query.featured = featured === "true";
    }

    // Build sorting options
    let sortOption = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === "price-asc") sortOption = { price: 1 };
      else if (sort === "price-desc") sortOption = { price: -1 };
      else if (sort === "newest") sortOption = { createdAt: -1 };
    }

    // Pagination setup
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("brand", "name slug logo")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug description")
      .populate("brand", "name slug logo description");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, shortDescription, price, category, brand, featured, inStock, tag } = req.body;

    let specifications = [];
    if (req.body.specifications) {
      try {
        specifications = typeof req.body.specifications === "string" 
          ? JSON.parse(req.body.specifications) 
          : req.body.specifications;
      } catch (err) {
        return res.status(400).json({ message: "Invalid specifications JSON format" });
      }
    }

    // Images: if real files were uploaded use them, otherwise fall back to URL strings
    let images = [];
    if (req.files && req.files.length > 0) {
      // real file uploads (memory buffer — store URL if using Cloudinary, or skip)
      images = req.files.map((f) => f.originalname);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    if (req.body.image && !images.includes(req.body.image)) {
      images.unshift(req.body.image);
    }

    // Derive featured from explicit featured field OR from tag
    const isFeatured = featured === "true" || featured === true || tag === "Featured";

    const product = await Product.create({
      name,
      description: description || shortDescription || "",
      shortDescription: shortDescription || description || "",
      price: price ? Number(price) : 0,
      category,
      brand,
      specifications,
      images,
      image: images[0] || "",
      tag: tag || "",
      featured: isFeatured,
      inStock: inStock === "true" || inStock === true || inStock === undefined,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: error.message || "Server error creating product" });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, shortDescription, price, category, brand, featured, inStock, existingImages, tag } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || shortDescription || product.description;
    product.shortDescription = shortDescription || description || product.shortDescription;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.tag = tag !== undefined ? tag : product.tag;
    product.featured = featured !== undefined
      ? (featured === "true" || featured === true || tag === "Featured")
      : product.featured;
    product.inStock = inStock !== undefined ? (inStock === "true" || inStock === true) : product.inStock;

    if (req.body.specifications) {
      try {
        product.specifications = typeof req.body.specifications === "string"
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
      } catch (err) {
        return res.status(400).json({ message: "Invalid specifications JSON format" });
      }
    }

    // Build images array: start from retained existing, add any new file uploads
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => f.originalname);
      images = [...images, ...newImages];
    }
    // Always update if an explicit image URL was pasted
    if (req.body.image && !images.includes(req.body.image)) {
      images.unshift(req.body.image);
    }
    if (images.length > 0) {
      product.images = images;
      product.image = images[0];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: error.message || "Server error updating product" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
