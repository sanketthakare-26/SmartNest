const Brand = require("../models/Brand");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching brands" });
  }
};

// @desc    Get single brand by slug
// @route   GET /api/brands/:slug
// @access  Public
const getBrandBySlug = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching brand" });
  }
};

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    let logo = "";
    if (req.file) {
      logo = req.file.path.startsWith("http")
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (req.body.logo) {
      logo = req.body.logo;
    }

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = await Brand.create({
      name,
      description,
      logo,
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error creating brand" });
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.name = name || brand.name;
    brand.description = description || brand.description;

    if (req.file) {
      brand.logo = req.file.path.startsWith("http")
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (logo !== undefined) {
      brand.logo = logo;
    }

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error updating brand" });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.deleteOne();
    res.json({ message: "Brand removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting brand" });
  }
};

module.exports = {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
