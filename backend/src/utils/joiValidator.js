import Joi from "joi";

export default Joi.object({
  name: Joi.string().min(3).max(40).trim().required(),
  email: Joi.string()
    .trim()
    .email({
      ignoreLength: true,
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "io"] },
    })
    .required(),
  gstin: Joi.string().trim().alphanum().length(15).required(),
  pan: Joi.string().trim().alphanum().length(10).required(),
  account: Joi.object({
    acc_no: Joi.string()
      .trim()
      .pattern(new RegExp("^[0-9]{11,16}$"))
      .required(),
    bank: Joi.string().trim().required(),
    ifsc: Joi.string().alphanum().trim().uppercase().length(11).required(),
  }),
  address: Joi.object({
    street: Joi.string().max(50).required(),
    city: Joi.string().min(3).max(15).required(),
    state: Joi.string().min(3).max(15).required(),
    pin: Joi.string().pattern(new RegExp("^[0-9]{6}$")).required(),
    country: Joi.string().min(3).max(15).required(),
  }),
  contact: Joi.string().trim().pattern(new RegExp("^[0-9]{10}$")).required(),
  password: Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,20}$"))
    .required(),
});

export const OrgValidator = Joi.object({
  name: Joi.string().min(3).max(40).trim().required(),
  gstin: Joi.string().trim().alphanum().length(15).required(),
  tds: Joi.number().min(0).max(10),
  address: Joi.object({
    street: Joi.string().max(50).required(),
    city: Joi.string().min(3).max(15).required(),
    state: Joi.string().min(3).max(15).required(),
    pin: Joi.string().pattern(new RegExp("^[0-9]{6}$")).required(),
    country: Joi.string().min(3).max(15).required(),
  }),
  active: Joi.boolean().required(),
});

export const UpdateValidator = Joi.object({
  name: Joi.string().min(3).max(40).trim(),
  gstin: Joi.string().trim().alphanum().length(15),
  address: Joi.object({
    street: Joi.string().max(50),
    city: Joi.string().min(3).max(15),
    state: Joi.string().min(3).max(15),
    pin: Joi.string().pattern(new RegExp("^[0-9]{6}$")),
    country: Joi.string().min(3).max(15),
  }),
});

export const projectValidator = Joi.object({
  description: Joi.string().min(3).max(50).trim(),
  projectType: Joi.string(),
  rate: Joi.object({
    currency: Joi.string().required(),
    rate: Joi.number().when("projectType", {
      is: "hourly",
      then: Joi.number().min(0).required(),
      otherwise: Joi.number(),
    }),
  }),
  conversionRate: Joi.number()
    .when("currency", {
      is: "INR",
      then: Joi.number().required(),
      otherwise: Joi.number(),
    })
    .min(0),
  projectAmount: Joi.number().when("projectType", {
    is: "monthly" | "fixed",
    then: Joi.number().positive().required(),
  }),
  projectCycle: Joi.string().required(),
  projectBelongsTo: Joi.string().trim(),
  projectCreatedBy: Joi.string().trim(),
  active: Joi.boolean(),
});

export const InvoiceValidator = Joi.object({
  createdBy: Joi.string().trim().required(),
  createdOn: Joi.date().min("1-1-1974").max(Date.now()).required(),
  projectsSelected: Joi.array().items(
    Joi.object({
      id: Joi.number().min(0).required(),
      projectDetails: Joi.string().required(),
      period: Joi.number().min(1),
      totalAmount: Joi.number().positive(),
    })
  ),
  subTotal: Joi.number().min(0),
  gst:
    Joi.object({
      cgst: Joi.number().min(0).required(),
      sgst: Joi.number().min(0).required(),
    }) || Joi.number().positive(),
  total: Joi.number().positive(),
  invoiceCreatedBy: Joi.string().trim(),
  active: Joi.boolean().required(),
});
