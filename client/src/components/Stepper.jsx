
const Stepper = ({
  currentCategory,
  categories,
  completedSteps,
  onCategoryClick,
}) => {
  return (
    <div className="flex flex-col items-start p-6 space-y-4 bg-white rounded-3xl w-full shadow-2xl transition-transform transform hover:scale-105 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() => onCategoryClick(category._id)}
          className={`w-full py-3 px-4 text-left rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            currentCategory === category._id
              ? "bg-blue-600 text-white"
              : completedSteps.has(category._id)
              ? "bg-green-200 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {category.categoryName}
        </div>
      ))}
      <p className="mt-6 text-gray-600">
        Progress:{" "}
        {categories.findIndex((cat) => cat.id === currentCategory) + 1} of{" "}
        {categories.length}
      </p>
    </div>
  );
};

export default Stepper
