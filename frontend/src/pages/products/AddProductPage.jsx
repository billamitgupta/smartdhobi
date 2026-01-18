import { useState } from "react";
import { ChevronLeft, Plus,CheckCircle  } from "lucide-react";
import ImageUploadSection from "./ImageUploadSection";
import { useGetSubCategoriesQuery,  useCreateProductMutation, useGetSubCategoriesByCategoryQuery} from "../../store/api/productsApi"; 
function AddProductPage({
  onBack,
  categories,
  dealers,
  isDealer,
  user,
}) {
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    dealerId: isDealer ? user?._id : "",
    title: "",
    shortDescription: "",
    sku: "",
    brand: "",
    dealerPrice: "",
    stock: "",
  });
  const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState("success");

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
 const { data: subcategoriesResponse, isLoading: subCategoriesLoading, error: subCategoriesError } =
  useGetSubCategoriesByCategoryQuery(formData.categoryId, {
    skip: !formData.categoryId,
  });
const subcategories = subCategoriesError || !subcategoriesResponse ? [] : subcategoriesResponse;
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const showToastMessage = (message, type = "success") => {
  setToastMessage(message);
  setToastType(type);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
};

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
    // Reset subcategory when category changes
    ...(name === "categoryId" ? { subCategoryId: "" } : {}),
  }));
  
  // Clear subcategory when category changes
  if (name === "categoryId") {
    setFormData(prev => ({ ...prev, subCategoryId: "" }));
  }
};

  console.log("subcategories:", subcategories);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting formData:", formData);
    // Validation
    if (
      !formData.title ||
      !formData.categoryId ||
      !formData.subCategoryId ||
      !formData.dealerPrice
    ) {
      showToastMessage("Please fill all required fields", "error");
      return;
    }


    if (images.length === 0) {
      showToastMessage("Please upload at least one product image", "error");
      return;
    }

    if (!isDealer && !formData.dealerId) {
      alert("Please select a dealer");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("subCategoryId", formData.subCategoryId);
      formDataToSend.append("dealerPrice", formData.dealerPrice);
      formDataToSend.append("stock", formData.stock || 0);

      if (formData.sku) formDataToSend.append("sku", formData.sku);
      if (formData.brand) formDataToSend.append("brand", formData.brand);
      if (formData.shortDescription)
        formDataToSend.append("shortDescription", formData.shortDescription);

      if (isDealer) {
        formDataToSend.append("dealerId", user._id);
      } else {
        formDataToSend.append("dealerId", formData.dealerId);
      }

      // Append all images
      images.forEach((img, index) => {
        formDataToSend.append(`images`, img.file);
      });

      // API call
      const result = await createProduct(formDataToSend).unwrap();

      if (result.success) {
        alert("Product added successfully!");
        // Clean up image previews
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        onBack();
      } else {
        alert(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-6 ">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
          
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
          <form onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <ImageUploadSection
              images={images}
              setImages={setImages}
              maxImages={6}
            />

            <hr className="border-gray-200" />

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>

              {/* Product Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the product"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Subcategory *
  </label>
  <select
    name="subCategoryId"
    value={formData.subCategoryId}
    onChange={handleInputChange}
    required
    disabled={!formData.categoryId || subCategoriesLoading}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">
      {subCategoriesLoading 
        ? "Loading..." 
        : !formData.categoryId 
        ? "Select Category First"
        : subcategories.length === 0
        ? "No subcategories found in this category"
        : "Select Subcategory"}
    </option>
    {subcategories.map((sub) => (
      <option key={sub._id} value={sub._id}>
        {sub.name}
      </option>
    ))}
  </select>
</div>
              </div>

              {/* Brand & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g., EL-TV-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dealer Selection (Admin Only) */}
              {!isDealer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer *
                  </label>
                  <select
                    name="dealerId"
                    value={formData.dealerId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Dealer</option>
                    {dealers.map((dealer) => (
                      <option key={dealer._id} value={dealer._id}>
                        {dealer.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="dealerPrice"
                    value={formData.dealerPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
