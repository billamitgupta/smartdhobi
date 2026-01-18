import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  FolderTree,
  Tag,
  Edit2,
  Trash2,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { 
  useGetCategoriesQuery, 
  useGetSubCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation
} from "../../store/api/productsApi"
const CategoryManagement = () => {
  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useGetCategoriesQuery();
const { data: subcategoriesData, isLoading: subcategoriesLoading, refetch: refetchSubcategories } = useGetSubCategoriesQuery();
const [createCategory] = useCreateCategoryMutation();
const [updateCategory] = useUpdateCategoryMutation();
const [createSubCategory] = useCreateSubCategoryMutation();
const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [search, setSearch] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'category' or 'subcategory'
const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    categoryId: "",
  });

  

  const [categoryErrors, setCategoryErrors] = useState({});
  const [subcategoryErrors, setSubcategoryErrors] = useState({});
  const isLoadingData = categoriesLoading || subcategoriesLoading || isLoading;

  // Mock data for demonstration
useEffect(() => {
  if (categoriesData) {
    // Handle if data is nested in a 'data' property or is directly an array
    const categoryArray = Array.isArray(categoriesData) 
      ? categoriesData 
      : categoriesData.data || [];
    setCategories(categoryArray);
  }
}, [categoriesData]);

useEffect(() => {
  if (subcategoriesData) {
    // Handle if data is nested in a 'data' property or is directly an array
    const subcategoryArray = Array.isArray(subcategoriesData) 
      ? subcategoriesData 
      : subcategoriesData.data || [];
    setSubcategories(subcategoryArray);
  }
}, [subcategoriesData]);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Get subcategories for a category with search filter
const getSubcategoriesForCategory = (categoryId) => {
  return (subcategories || []).filter(
    sub => sub.categoryId === categoryId && 
    sub.name.toLowerCase().includes(search.toLowerCase())
  );
};

  // Filter categories based on search (search in both category and subcategory names)
const filteredCategories = (categories || []).filter(cat => {
  const categoryMatches = cat.name.toLowerCase().includes(search.toLowerCase());
  const hasMatchingSubcategory = (subcategories || []).some(
    sub => sub.categoryId === cat._id && 
    sub.name.toLowerCase().includes(search.toLowerCase())
  );
  return categoryMatches || hasMatchingSubcategory;
});

  // Toast function
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Validate Category Form
  const validateCategoryForm = () => {
    const errors = {};
    if (!categoryForm.name.trim()) errors.name = "Category name is required";
    setCategoryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Subcategory Form
  const validateSubcategoryForm = () => {
    const errors = {};
    if (!subcategoryForm.name.trim())
      errors.name = "Subcategory name is required";
    if (!subcategoryForm.categoryId)
      errors.categoryId = "Please select a category";
    setSubcategoryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Category Form Change
  const handleCategoryChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    setCategoryErrors({ ...categoryErrors, [e.target.name]: "" });
  };

  // Handle Subcategory Form Change
  const handleSubcategoryChange = (e) => {
    setSubcategoryForm({ ...subcategoryForm, [e.target.name]: e.target.value });
    setSubcategoryErrors({ ...subcategoryErrors, [e.target.name]: "" });
  };

// Submit Category (Create or Update)
const handleCategorySubmit = async () => {
  if (!validateCategoryForm()) return;
  
  setIsLoading(true);
  try {
    if (isEditMode) {
      await updateCategory({ id: editingId, data: categoryForm }).unwrap();
      showToastMessage("Category updated successfully!", "success");
    } else {
      await createCategory(categoryForm).unwrap();
      showToastMessage("Category added successfully!", "success");
    }
    refetchCategories();
    closeCategoryModal();
  } catch (error) {
    console.error("Error:", error);
    showToastMessage(
      error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} category`,
      "error"
    );
  } finally {
    setIsLoading(false);
  }
};

// Submit Subcategory (Create or Update)
const handleSubcategorySubmit = async () => {
  if (!validateSubcategoryForm()) return;
  
  setIsLoading(true);
  try {
    if (isEditMode) {
      await updateSubCategory({ id: editingId, data: subcategoryForm }).unwrap();
      showToastMessage("Subcategory updated successfully!", "success");
    } else {
      await createSubCategory(subcategoryForm).unwrap();
      showToastMessage("Subcategory added successfully!", "success");
    }
    refetchSubcategories();
    closeSubcategoryModal();
  } catch (error) {
    console.error("Error:", error);
    showToastMessage(
      error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} subcategory`,
      "error"
    );
  } finally {
    setIsLoading(false);
  }
};

  // Edit Category
  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setEditingId(category._id);
    setCategoryForm({
      name: category.name,
    });
    setShowCategoryModal(true);
  };

  // Edit Subcategory
  const handleEditSubcategory = (subcategory) => {
    setIsEditMode(true);
    setEditingId(subcategory._id);
    setSubcategoryForm({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
    });
    setShowSubcategoryModal(true);
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {

    console.log("Delete Category ID:", id);
    setDeleteTarget(id);
    setDeleteType('category');
    setShowDeleteModal(true);
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (id) => {
    console.log("Delete Subcategory ID:", id);
    setDeleteTarget(id);
    setDeleteType('subcategory');
    setShowDeleteModal(true);
  };

// Confirm Delete
const confirmDelete = async () => {
  setIsLoading(true);
  try {
    if (deleteType === 'category') {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/categories/deleteCategory/${deleteTarget}`);
      showToastMessage("Category deleted successfully!", "success");
      refetchCategories(); // Add this line
      refetchSubcategories(); // Add this line
    } else {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/subCategories/deleteSubCategory/${deleteTarget}`);
      showToastMessage("Subcategory deleted successfully!", "success");
      refetchSubcategories(); // Add this line
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteType(null);
  } catch (error) {
    console.error("Error deleting:", error);
    showToastMessage(
      error?.response?.data?.message || `Failed to delete ${deleteType}`,
      "error"
    );
  } finally {
    setIsLoading(false);
  }
};
  // Cancel Delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteType(null);
  };

  // Close Modals
  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryForm({ name: "" });
    setCategoryErrors({});
    setIsEditMode(false);
    setEditingId(null);
  };

  const closeSubcategoryModal = () => {
    setShowSubcategoryModal(false);
    setSubcategoryForm({ name: "", categoryId: "" });
    setSubcategoryErrors({});
    setIsEditMode(false);
    setEditingId(null);
  };

  // Get Category Name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`${
              toastType === "success"
                ? "bg-green-600"
                : toastType === "error"
                ? "bg-red-600"
                : "bg-amber-800"
            } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
    {isLoadingData && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
    <div className="bg-white p-4 rounded-lg shadow-xl">
      <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
    </div>
  </div>
)}

      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories or subcategories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {filteredCategories.map((category) => {
            const categorySubcategories = getSubcategoriesForCategory(category._id);
            const isExpanded = expandedCategories[category._id];

            return (
              <div key={category._id} className="border-b border-gray-100 last:border-b-0">
                {/* Category Row */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {categorySubcategories.length} subcategories
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSubcategoryForm({ name: "", categoryId: category._id });
                        setShowSubcategoryModal(true);
                      }}
                      className="p-2 hover:bg-green-50 rounded-lg transition text-green-600"
                      title="Add Subcategory"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories - Expandable */}
                {isExpanded && categorySubcategories.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {categorySubcategories.map((subcategory) => (
                      <div
                        key={subcategory._id}
                        className="flex items-center justify-between p-4 pl-16 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-green-700" />
                          </div>
                          <p className="font-medium text-gray-800 text-sm">
                            {subcategory.name}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSubcategory(subcategory)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(subcategory._id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && categorySubcategories.length === 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 p-8 text-center">
                    <p className="text-gray-500 text-sm">No subcategories found</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No categories found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditMode ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={closeCategoryModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    categoryErrors.name ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g., Electronics"
                />
                {categoryErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {categoryErrors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
              <button
                onClick={closeCategoryModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorySubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition disabled:opacity-50"
              >
                {isEditMode ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
              </h2>
              <button
                onClick={closeSubcategoryModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category *
                </label>
                <select
                  name="categoryId"
                  value={subcategoryForm.categoryId}
                  onChange={handleSubcategoryChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    subcategoryErrors.categoryId
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {subcategoryErrors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">
                    {subcategoryErrors.categoryId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={subcategoryForm.name}
                  onChange={handleSubcategoryChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    subcategoryErrors.name
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder="e.g., Mobile Phones"
                />
                {subcategoryErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {subcategoryErrors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border rounded-2xl bg-gray-50">
              <button
                onClick={closeSubcategoryModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubcategorySubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {isEditMode ? "Update Subcategory" : "Add Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                Delete {deleteType === 'category' ? 'Category' : 'Subcategory'}?
              </h2>
              
              <p className="text-gray-600 text-center text-sm mb-6">
                {deleteType === 'category' 
                  ? "This will permanently delete this category and all its subcategories. This action cannot be undone."
                  : "This will permanently delete this subcategory. This action cannot be undone."
                }
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;