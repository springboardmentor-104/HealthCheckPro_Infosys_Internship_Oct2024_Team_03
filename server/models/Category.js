import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalScore: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;
