import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  CheckCircle,
  Loader2,
  Link,
  Upload,
  Filter,
} from "lucide-react";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "../../store/api/bannersApi";
import {
  setBanners,
  setSearchFilter,
  setActiveFilter,
  setSortBy,
  resetFilters,
  selectFilteredBanners,
  selectBannerFilters,
} from "../../store/slices/bannerSlice";

const BannerManagement = () => {
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const { data: bannersData, isLoading: bannersLoading } = useGetBannersQuery();
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  // Redux selectors
  const filteredBanners = useSelector(selectFilteredBanners);
  const filters = useSelector(selectBannerFilters);

  // Local state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [bannerForm, setBannerForm] = useState({
    title: "",
    link: "",
    order: 0,
    isActive: true,
    images: null,
  });

  const [bannerErrors, setBannerErrors] = useState({});

  // Update Redux store when data is fetched
  useEffect(() => {
    if (bannersData) {
      const bannerArray = Array.isArray(bannersData) 
        ? bannersData 
        : bannersData.banners || bannersData.data || [];
      dispatch(setBanners(bannerArray));
    }
  }, [bannersData, dispatch]);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const validateBannerForm = () => {
    const errors = {};
    if (!bannerForm.title?.trim()) errors.title = "Banner title is required";
    if (!isEditMode && !bannerForm.images) errors.images = "Banner images is required";
    if (bannerForm.order < 0) errors.order = "Order must be 0 or greater";
    setBannerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBannerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm({
      ...bannerForm,
      [name]: type === "checkbox" ? checked : value,
    });
    setBannerErrors({ ...bannerErrors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setBannerErrors({ ...bannerErrors, images: "Image size must be less than 5MB" });
        return;
      }
      setBannerForm({ ...bannerForm, images: file });
      setBannerErrors({ ...bannerErrors, images: "" });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = async () => {
    if (!validateBannerForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("link", bannerForm.link || "");
      formData.append("order", bannerForm.order);
      formData.append("isActive", bannerForm.isActive);
      
      if (bannerForm.images) {
        formData.append("images", bannerForm.images);
      }

      if (isEditMode) {
        await updateBanner({ id: editingId, formData }).unwrap();
        showToastMessage("Banner updated successfully!", "success");
      } else {
        await createBanner(formData).unwrap();
        showToastMessage("Banner added successfully!", "success");
      }
      
      closeBannerModal();
    } catch (error) {
      console.error("Error:", error);
      showToastMessage(
        error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} banner`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setIsEditMode(true);
    setEditingId(banner._id);
    setBannerForm({
      title: banner.title || "",
      link: banner.link || "",
      order: banner.order || 0,
      isActive: banner.isActive,
      images: null,
    });
    setImagePreview(banner.imageUrl);
    setShowBannerModal(true);
  };

  const handleDeleteBanner = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBanner(deleteTarget).unwrap();
      showToastMessage("Banner deleted successfully!", "success");
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting:", error);
      showToastMessage(
        error?.data?.message || "Failed to delete banner",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
    setBannerForm({
      title: "",
      link: "",
      order: 0,
      isActive: true,
      images: null,
    });
    setBannerErrors({});
    setIsEditMode(false);
    setEditingId(null);
    setImagePreview(null);
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchFilter(value));
  };

  const handleActiveFilterChange = (value) => {
    dispatch(setActiveFilter(value));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
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

      {(bannersLoading || isLoading) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
          </div>
        </div>
      )}

      <div className="flex-shrink-0 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banner Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredBanners.length} banner{filteredBanners.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <button
            onClick={() => setShowBannerModal(true)}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banners..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition bg-white"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {(filters.search || filters.isActive !== null || filters.sortBy !== "order") && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-sm text-amber-800 hover:bg-amber-50 rounded-lg transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.isActive === null ? "all" : filters.isActive ? "active" : "inactive"}
                  onChange={(e) => {
                    const val = e.target.value === "all" ? null : e.target.value === "active";
                    handleActiveFilterChange(val);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Banners</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="order">Display Order</option>
                  <option value="createdAt">Newest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={banner.images}
                  alt={banner.alt || banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    Order: {banner.order}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">
                  {banner.title || "Untitled Banner"}
                </h3>
                
                {banner.link && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Link className="w-3 h-3" />
                    <span className="truncate">{banner.link}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 hover:bg-red-50 rounded-lg transition text-red-600 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBanners.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No banners found</p>
            <p className="text-sm">
              {filters.search || filters.isActive !== null
                ? "Try adjusting your filters or search terms"
                : "Get started by creating your first banner"}
            </p>
          </div>
        )}
      </div>

      {showBannerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditMode ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button
                onClick={closeBannerModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image * {isEditMode && "(Leave empty to keep current image)"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-48 mb-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                            setBannerForm({ ...bannerForm, images: null });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload banner image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 5MB (1200x600 recommended)
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {bannerErrors.images && (
                  <p className="text-red-500 text-xs mt-1">{bannerErrors.images}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={bannerForm.title}
                  onChange={handleBannerChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    bannerErrors.title ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="e.g., Summer Sale 2024"
                />
                {bannerErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{bannerErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  name="link"
                  value={bannerForm.link}
                  onChange={handleBannerChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., /products/sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={bannerForm.order}
                  onChange={handleBannerChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    bannerErrors.order ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="0"
                />
                {bannerErrors.order && (
                  <p className="text-red-500 text-xs mt-1">{bannerErrors.order}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={bannerForm.isActive}
                  onChange={handleBannerChange}
                  className="w-4 h-4 text-amber-800 border-gray-300 rounded focus:ring-amber-500"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (Display on website)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeBannerModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBannerSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition disabled:opacity-50"
              >
                {isEditMode ? "Update Banner" : "Add Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                Delete Banner?
              </h2>

              <p className="text-gray-600 text-center text-sm mb-6">
                This will permanently delete this banner. This action cannot be undone.
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

export default BannerManagement;