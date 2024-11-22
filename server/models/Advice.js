import mongoose from "mongoose";

const AdviceSchema = new mongoose.Schema(
  {
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    advices: {
        type: Array,
        default: []
    },
    forScore: {
        type: String,
        enum: ["Poor", "Average", "Excellent"]
    }, // poor, average, excellent
  },
  { timestamps: true }
);

const Advice = mongoose.model("Advice", AdviceSchema);
export default Advice;
