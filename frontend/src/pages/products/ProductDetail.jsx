import { useState,useEffect  } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery, useGetProductsQuery } from "../../store/api/productsApi";
import { ChevronLeft, Star, Package, User, Calendar, CheckCircle, XCircle,Save  } from "lucide-react";
import axios from "axios";

export default function ProductDetail() {
  const { productId } = useParams();
const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);
  const [selectedImage, setSelectedImage] = useState(0);
const [commission, setCommission] = useState(0);
const [isEditingCommission, setIsEditingCommission] = useState(false);
const [isSaving, setIsSaving] = useState(false);

useEffect(() => {
  if (product) {
    setCommission(product.commission || 0);
  }
}, [product]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

const handleCommissionUpdate = async () => {
  setIsSaving(true);
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/employee/products/commission/${productId}`,
      { 
        commission: parseFloat(commission),
        customerPrice: product.dealerPrice + parseFloat(commission)
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      setIsEditingCommission(false);
      alert('Commission updated successfully!');
      refetch();
    }
  } catch (error) {
    console.error('Failed to update commission:', error);
    const errorMessage = error.response?.data?.message || 'Error updating commission. Please try again.';
    alert(errorMessage);
  } finally {
    setIsSaving(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="aspect-square flex items-center justify-center p-8">
                <img
                  src={product.images[selectedImage]?.url || "/placeholder.png"}
                  alt={product.images[selectedImage]?.alt || product.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image._id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              {product.isApproved ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approved
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <XCircle className="w-4 h-4 mr-1" />
                  Pending Approval
                </span>
              )}
              {product.isActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-gray-600">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                {product.rating.toFixed(1)}
                <Star className="w-3 h-3 ml-1 fill-current" />
              </div>
              <span className="text-gray-600 text-sm">
                {product.ratingCount} {product.ratingCount === 1 ? 'Rating' : 'Ratings'}
              </span>
            </div>

          {/* Price */}
<div className="bg-gray-50 rounded-lg  space-y-3">
  <div>
    <div className="text-2xl font-bold text-gray-900">
      ₹{product.dealerPrice.toLocaleString()}
    </div>
    <p className="text-sm text-gray-600">Dealer Price</p>
  </div>
  
  {/* Commission Input */}
  <div className="border-t pt-3">
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-medium text-gray-700">Commission</label>
      {!isEditingCommission && (
        <button
          onClick={() => setIsEditingCommission(true)}
          className="text-sm text-blue-900 font-semibold hover:text-blue-700"
        >
          Edit
        </button>
      )}
    </div>
    
    {isEditingCommission ? (
      <div className="flex gap-2">
        <input
          type="number"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter commission"
        />
        <button
          onClick={handleCommissionUpdate}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              Save
            </>
          )}
        </button>
        <button
          onClick={() => {
            setCommission(product.commission || 0);
            setIsEditingCommission(false);
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className="text-lg font-semibold text-gray-900">
        ₹{(commission || 0).toLocaleString()}
      </div>
    )}
  </div>
  
  {/* Customer Price */}
  <div className="border-t pt-3">
    <p className="text-sm text-gray-600 mb-1">Customer Price</p>
    <div className="text-2xl font-bold text-green-600">
      ₹{(product.dealerPrice + parseFloat(commission || 0)).toLocaleString()}
    </div>
  </div>
</div>

            {/* Product Information */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="font-medium text-gray-900">{product.brand}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-medium text-gray-900">{product.sku}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{product.categoryId.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Sub Category</p>
                  <p className="font-medium text-gray-900">{product.subCategoryId.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    {product.stock} units
                  </p>
                </div>
              </div>
            </div>

            {/* Dealer Information */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Dealer Information</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Dealer Name</p>
                    <p className="font-medium text-gray-900">{product.dealerId.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 ml-7">Email: </span>
                  <span className="font-medium text-gray-900 ml-2">{product.dealerId.email}</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t pt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Created: {new Date(product.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              {product.approvedAt && (
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approved: {new Date(product.approvedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}