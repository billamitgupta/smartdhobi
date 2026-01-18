import { useState } from "react";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetDealersQuery,
  useGetProductsQuery,
  useGetSubCategoriesQuery,
  useApproveProductMutation,
  useRejectProductMutation,
} from "../../store/api/productsApi";
import {
  ChevronDown,
  Filter,
  Package,
  Plus,
  Search,
  X,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import AddProductPage from "./AddProductPage";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;
  const isDealer = user?.role === "dealer";
const navigate = useNavigate();
  // New product form state
  const [newProduct, setNewProduct] = useState({
    categoryId: "",
    subCategoryId: "",
    dealerId: "",
    title: "",
    shortDescription: "",
    sku: "",
    dealerPrice: "",
    stock: "",
    images: [],
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // RTK Query hooks
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const categories = categoriesResponse?.data ?? [];

  // Subcategories for filter dropdown
  const { data: subCategories, isLoading: subCategoriesLoading } =
    useGetSubCategoriesQuery(selectedCategory, { skip: !selectedCategory });

  // Subcategories for modal dropdown
  const {
    data: modalSubCategoriesResponse,
    isLoading: modalSubCategoriesLoading,
  } = useGetSubCategoriesQuery(newProduct.categoryId, {
    skip: !newProduct.categoryId,
  });
  const modalSubCategories = modalSubCategoriesResponse ?? [];

  const { data: dealersResponse, isLoading: dealersLoading } =
    useGetDealersQuery();
  const dealers = dealersResponse?.data ?? [];

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({
    categoryId: selectedCategory,
    subCategoryId: selectedSubCategory,
    search,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [approveProduct, { isLoading: isApproving }] =
    useApproveProductMutation();
  const [rejectProduct, { isLoading: isRejecting }] =
    useRejectProductMutation();

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
  };

  const handleModalCategoryChange = (categoryId) => {
    console.log("Selected Category ID in Modal:", categoryId);

    setNewProduct({
      ...newProduct,
      categoryId,
      subCategoryId: "", // Reset subcategory
    });
  };

  const handleAddProduct = async () => {
    let dealerId = newProduct.dealerId;

    if (user.role === "dealer") {
      dealerId = user._id;
      newProduct.dealerId = user._id;
    }

    console.log(dealerId, "dealerId");

    console.log(newProduct, "asdfasd");
    // Validation
    if (
      !newProduct.title ||
      !newProduct.dealerPrice ||
      !newProduct.categoryId ||
      !newProduct.subCategoryId ||
      !newProduct.dealerId
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await createProduct({
        ...newProduct,
        dealerPrice: Number(newProduct.dealerPrice),
        stock: Number(newProduct.stock) || 0,
      }).unwrap();

      // Reset form
      setNewProduct({
        categoryId: "",
        subCategoryId: "",
        dealerId: "",
        title: "",
        shortDescription: "",
        sku: "",
        dealerPrice: "",
        stock: "",
      });
      setShowModal(false);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  console.log("formdata sdfasd", newProduct);
  const handleApprove = async (productId) => {
    try {
      await approveProduct(productId).unwrap();
      alert("Product approved successfully!");
    } catch (error) {
      console.error("Failed to approve product:", error);
      alert("Failed to approve product.");
    }
  };

  const handleDecline = async (productId) => {
    try {
      await rejectProduct(productId).unwrap();
      alert("Product rejected successfully!");
    } catch (error) {
      console.error("Failed to reject product:", error);
      alert("Failed to reject product.");
    }
  };

  if (showAddForm) {
    return (
      <AddProductPage
        onBack={() => setShowAddForm(false)}
        categories={categories}
        dealers={dealers}
        isDealer={isDealer}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-2">
        {/* Title Bar with Search, Filter, Add Product */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-800">Product List</h2>

          <div className="flex items-center gap-3 flex-1 justify-end flex-wrap">
            {/* Search */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={categoriesLoading}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat?.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* SubCategory Filter */}
            {selectedCategory && (
              <div className="relative">
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={subCategoriesLoading}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Subcategories</option>
                  {subCategories?.length === 0 && !subCategoriesLoading ? (
                    <option disabled>No subcategories available</option>
                  ) : (
                    subCategories?.map((sub) => (
                      <option key={sub._id || sub.id} value={sub._id || sub.id}>
                        {sub?.name}
                      </option>
                    ))
                  )}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            {/* Add Product Button - Hidden for Admin */}
            {isDealer && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-medium transition shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Products Count */}
        {productsLoading ? (
          <p className="text-sm text-gray-500 mb-4">Loading products...</p>
        ) : productsError ? (
          <p className="text-sm text-red-500 mb-4">Error loading products</p>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            {products.length} products found
          </p>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Product
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Category
                  </th>
                  {!isDealer && (
                    <th className="py-3 px-4 font-medium text-gray-600 text-sm text-center">
                      Dealer
                    </th>
                  )}

                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    SKU
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Price
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Stock
                  </th>
                  <th className="py-3 px-4 font-medium text-gray-600 text-sm">
                    Status
                  </th>
                  {!isDealer && (
                    <th className="py-3 px-4 font-medium text-gray-600 text-sm text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {productsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td colSpan={!isDealer ? "7" : "6"} className="py-4 px-4">
                        <div className="animate-pulse flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={!isDealer ? "7" : "6"}
                      className="py-12 text-center text-gray-500"
                    >
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p>No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id || product.id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition"
                    >
                      {/* Product Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3"     onClick={()=>{
                          navigate(`${product._id || product.id}`)
                        }}                >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <Package className="w-6 h-6 text-amber-700 opacity-50" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            {product?.categoryId?.name || product.categoryId}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product?.subCategoryId?.name || product.subCategory}
                          </p>
                        </div>
                      </td>

                      {!isDealer && (
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">
                            {product?.dealerId?.name || product.dealerId  }
                          </span>
                        </td>
                      )}

                      {/* SKU */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 font-mono">
                          {product.sku || "N/A"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-semibold text-gray-800">
                          ₹{product.dealerPrice}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-sm ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock}`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {product.isApproved === true ? "Approved" : "Pending"}
                      </td>

                      {/* Actions - Only for Admin */}
                      {!isDealer && (
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleApprove(product._id || product.id)
                              }
                              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDecline(product._id || product.id)
                              }
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                              title="Decline"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                Add New Product
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => handleModalCategoryChange(e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {newProduct.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory *
                  </label>
                  <select
                    value={newProduct.subCategoryId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        subCategoryId: e.target.value,
                      })
                    }
                    disabled={modalSubCategoriesLoading}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {modalSubCategories?.length === 0 &&
                    !modalSubCategoriesLoading ? (
                      <option disabled>No subcategories available</option>
                    ) : (
                      modalSubCategories?.map((sub) => (
                        <option
                          key={sub._id || sub.id}
                          value={sub._id || sub.id}
                        >
                          {sub.name}
                        </option>
                      ))
                    )}
                  </select>
                  {modalSubCategoriesLoading && (
                    <p className="text-xs text-gray-500 mt-1">
                      Loading subcategories...
                    </p>
                  )}
                </div>
              )}

              {/* Dealer */}
              {!isDealer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer *
                  </label>
                  <select
                    value={newProduct.dealerId}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, dealerId: e.target.value })
                    }
                    disabled={dealersLoading}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Dealer</option>
                    {dealers?.map((dealer) => (
                      <option
                        key={dealer._id || dealer.id}
                        value={dealer._id || dealer.id}
                      >
                        {dealer.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter product name"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={newProduct.shortDescription}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Brief description"
                  rows="2"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="EL-TV-001"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.dealerPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        dealerPrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
