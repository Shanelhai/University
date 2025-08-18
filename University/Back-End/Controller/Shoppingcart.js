import ShoppingCart from "../Models/Shoppingcart.js";
import ProductModels from "../Models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, count = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    const product = await ProductModels.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = Number(product.price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid product price" });
    }

    const countToAdd = parseInt(count);
    if (isNaN(countToAdd) || countToAdd === 0) {
      return res.status(400).json({ error: "Count must be a non-zero integer" });
    }

    const existingItem = await ShoppingCart.findOne({
      applicationUser: userId,
      product: productId,
    });

    if (existingItem) {
      const newCount = existingItem.count + countToAdd;

      if (newCount <= 0) {
        // ❌ Remove item if quantity goes to 0 or below
        await ShoppingCart.findByIdAndDelete(existingItem._id);
        return res.status(200).json({ message: "Item removed from cart" });
      }

      // ✅ Update existing item
      existingItem.count = newCount;
      existingItem.price = price;
      existingItem.totalPrice = newCount * price;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    // 🔒 Block adding new items with negative count
    if (countToAdd < 0) {
      return res.status(400).json({ error: "Cannot add item with negative quantity" });
    }

    // ✅ Create new item
    const newCartItem = await ShoppingCart.create({
      applicationUser: userId,
      product: productId,
      count: countToAdd,
      price: price,
      totalPrice: countToAdd * price,
    });

    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    
    const cart = await ShoppingCart.find({ applicationUser: userId })
      .populate("product")
      .populate("applicationUser", "name email"); 

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }

    const deleted = await ShoppingCart.findByIdAndDelete(itemId);

    if (!deleted) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
