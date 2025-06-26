// src/components/ProductGrid.jsx
import { useState, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "../api/axios"; // Ensure baseURL = '/api'

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/items");
      setProducts(res.data);

      const uniqueCats = [...new Set(res.data.map((item) => item.category))];
      setCategories(["All", ...uniqueCats]);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchSearch =
      product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="px-8 py-4 max-w-[1100px] mx-auto">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or code"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() =>
                onAddToCart({
                  _id: product._id, // ✅ Important fix: use _id not id
                  name: product.itemName,
                  price: product.price,
                })
              }
              className="relative group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-gray-800"
            >
              {/* Product Image */}
              <img
                src={product.imagePath || "/default.png"}
                alt={product.itemName}
                className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-t-lg transition-filter duration-300 ease-in-out group-hover:blur-[1px]"
                draggable={false}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="rounded-full bg-gray-900 bg-opacity-40 p-2 shadow-lg">
                  <PlusCircleIcon className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 text-center bg-white rounded-b-lg">
                <h3
                  className="text-md font-semibold text-gray-900 truncate"
                  title={product.itemName}
                >
                  {product.itemName}
                </h3>
                <p className="text-xs text-gray-500">{product.itemCode}</p>
                <p className="text-blue-700 font-bold mt-2">
                  Rs. {product.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
