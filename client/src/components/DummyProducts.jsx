// src/components/ProductGrid.jsx
import { useState } from "react";

const dummyProducts = [
  { id: 1, code: "P100", name: "Burger", price: 350, category: "Fast Food", image: "https://via.placeholder.com/100?text=Burger" },
  { id: 2, code: "P101", name: "Pizza", price: 1200, category: "Fast Food", image: "https://via.placeholder.com/100?text=Pizza" },
  { id: 3, code: "P102", name: "Fried Rice", price: 800, category: "Rice", image: "https://via.placeholder.com/100?text=Fried+Rice" },
  { id: 4, code: "P103", name: "Noodles", price: 700, category: "Noodles", image: "https://via.placeholder.com/100?text=Noodles" },
  { id: 5, code: "P104", name: "Curry", price: 450, category: "Curry", image: "https://via.placeholder.com/100?text=Curry" },
  { id: 6, code: "P105", name: "Juice", price: 300, category: "Drinks", image: "https://via.placeholder.com/100?text=Juice" },
];

const categories = ["All", "Fast Food", "Rice", "Noodles", "Curry", "Drinks"];

const ProductGrid = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = dummyProducts.filter((product) => {
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm ${
              selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or code"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white shadow-md rounded-lg p-2 cursor-pointer hover:bg-blue-50 flex flex-col items-center text-center"
            >
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mb-2 rounded" />
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="text-xs text-gray-600">{product.code}</p>
              <p className="text-blue-700 font-bold mt-1">Rs. {product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;