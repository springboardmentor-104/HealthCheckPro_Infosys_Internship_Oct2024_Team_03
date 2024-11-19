
const Stepper = ({
  currentCategory,
  categories,
  completedSteps,
  onCategoryClick,
  attemptNumber
}) => {
  return (
    <div className="flex flex-col items-start p-6 space-y-4 bg-white rounded-3xl w-full shadow-2xl transition-transform transform hover:scale-105 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() => onCategoryClick(category._id)}
          className={`w-full py-3 px-4 text-left rounded-full ${
            currentCategory === category._id
              ? "bg-blue-600 text-white cursor-pointer transition-all duration-300 transform hover:scale-105"
              : completedSteps.has(category._id)
              ? "bg-green-200 text-green-800 cursor-default"
              : "bg-gray-200 text-gray-700 cursor-pointer transition-all duration-300 transform hover:scale-105"
          }`}
        >
          {category.categoryName}
        </div>
      ))}
      <div className="flex-col justify-center space-y-1 ml-3 ">
        <p className="text-blue-500 text-left">
          Progress:{" "}
          <span className="font-semibold text-gray-700">
            {categories.findIndex((cat) => cat._id === currentCategory) + 1} of{" "}
            {categories.length}
          </span>
        </p>
        <p className="text-blue-500 text-left">
          Assessment Round:{" "}
          <span className="font-semibold text-gray-700">{attemptNumber}</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default Stepper
