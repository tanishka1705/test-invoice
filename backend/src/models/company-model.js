import mongoose, { Schema, model } from "mongoose";
import { OrgValidator } from "../utils/joiValidator";

const orgSchema = Schema(
  {
    name: { type: String, unique: true },
    gstin: { type: String, uppercase: true, unique: true },
    tds: {type: Number},
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pin: { type: String },
      country: { type: String },
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
    companyCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

orgSchema.methods.orgValidator = function (obj) {
  const schema = OrgValidator;
  return schema.validate(obj);
};

const Organization = model("organization", orgSchema);

export default Organization;
