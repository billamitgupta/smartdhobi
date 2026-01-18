export default function ProductListHeader({ onAddClick }) {
  return (
    <div className="flex items-center justify-between w-full mb-6">

      <h1 className="text-2xl font-semibold">Product List</h1>

      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-brown-700 text-white rounded-xl"
      >
        + Add Product
      </button>

    </div>
  );
}
