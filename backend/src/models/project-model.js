import mongoose, { Schema, model } from "mongoose";
import { projectValidator } from "../utils/joiValidator";

const projectSchema = Schema(
  {
    description: { type: String, unique: true, required: true },
    projectType: { type: String, required: true },
    rate: { type: Object, required: true },
    projectAmount: { type: Number },
    projectCycle: { type: String, required: true },
    conversionRate: { type: Number },
    projectBelongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },
    projectCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    active: { type: Boolean }
  },
  {
    timestamps: true,
  }
);

projectSchema.methods.projectValidator = function (obj) {
  const schema = projectValidator;
  return schema.validate(obj);
};

const Project = model("project", projectSchema);
export default Project;
