// src/components/ProductGrid.jsx
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";  // or try 24/outline if this errors

const dummyProducts = [
  { id: 1, code: "P100", name: "Burger", price: 150, category: "Fast Food", image: "public/images/i4.png" },
  { id: 2, code: "P101", name: "Fish Rolls", price: 100, category: "Fast Food", image: "public/images/i5.png" },
  { id: 3, code: "P102", name: "Full Chicken Fried Rice", price: 800, category: "Fried Rice", image: "public/images/i1.png" },
  { id: 4, code: "P103", name: "Full Noodles", price: 700, category: "Noodles", image: "public/images/i3.png" },
  { id: 5, code: "P104", name: "Rice and Curry", price: 450, category: "Curry", image: "public/images/i6.png" },
  { id: 6, code: "P105", name: "orange juice", price: 200, category: "Drinks", image: "public/images/i7.png" },
  { id: 7, code: "P106", name: "Pork Kottu Full", price: 350, category: "Kottu", image: "public/images/i2.png" },
  { id: 8, code: "P107", name: "Chicken Rolls", price: 150, category: "Fast Food", image: "public/images/i5.png" },
  { id: 9, code: "P108", name: "Half Chicken Fried Rice", price: 500, category: "Fried Rice", image: "public/images/i1.png" },
  { id: 10, code: "P109", name: "Full Chicken Kottu", price: 900, category: "Kottu", image: "public/images/i2.png" },
  { id: 11, code: "P110", name: "String Hoppers", price: 10, category: "Fast Food", image: "public/images/String Hoppers.jpg" },
  { id: 12, code: "P111", name: "Sprite", price: 150, category: "Drinks", image: "public/images/sprite.jpg" },
  { id: 13, code: "P112", name: "Samosa", price: 120, category: "Fast Food", image: "public/images/samosa.jpg" },
  { id: 14, code: "P113", name: "Hoppers", price: 25, category: "Fast Food", image: "public/images/hoppers.jpg" },
  { id: 15, code: "P114", name: "Full Poke Fried Rice", price: 800, category: "Fried Rice", image: "public/images/poke rice.png" },
  { id: 16, code: "P115", name: "Paratha", price: 70, category: "Fast Food", image: "public/images/paratha.png" },
  { id: 17, code: "P116", name: "egg hoppers", price: 100, category: "Fast Food", image: "public/images/egg hoppers.jpg" },
  { id: 18, code: "P117", name: "CocaCola", price: 150, category: "Drinks", image: "public/images/coca.jpg" },
];

const categories = ["All", "Fast Food", "Fried Rice", "Kottu", "Noodles", "Curry", "Drinks"];

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
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="relative group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-gray-800"
            >
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-t-lg transition-filter duration-300 ease-in-out group-hover:blur-[1px]"
                draggable={false}
              />

              {/* Hover Overlay with Plus Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="rounded-full bg-gray-900 bg-opacity-40 p-2 shadow-lg">
                  <PlusCircleIcon className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Product Details */}
              <div className="p-3 text-center bg-white rounded-b-lg">
                <h3 className="text-md font-semibold text-gray-900 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">{product.code}</p>
                <p className="text-blue-700 font-bold mt-2">Rs. {product.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;