import Invoice from "../models/invoice-model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const createInvoice = catchAsync(async (req, res, next) => {
  const {
    createdFor,
    invoiceNumber,
    createdOn,
    dueDate,
    projects,
    tds,
    discount,
    subtotal,
    GST,
    GrandTotal,
    status,
    invoiceType,
    active,
  } = req.body;

  const invoice = await Invoice({
    createdFor,
    invoiceNumber,
    createdOn,
    dueDate,
    projects,
    subtotal,
    tds,
    discount,
    GST,
    GrandTotal,
    invoiceCreatedBy: req.user._id,
    status,
    active,
    invoiceType,
  }).populate("createdFor");
  const newInvoice = await invoice.populate("projects.projectDetails");
  await newInvoice.save();

  res.status(201).json({
    status: "true",
    newInvoice,
  });
});

const getAllInvoice = catchAsync(async (req, res, next) => {
  const allInvoices = await Invoice.find({
    invoiceCreatedBy: req.user._id,
    active: true,
  })
    .populate("createdFor")
    .populate("projects.projectDetails")
    .populate("invoiceCreatedBy");
  res.status(201).json({ status: "true", allInvoices });
});

const getInvoiceById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const invoice = await Invoice.findById({ _id: id })
    .populate("createdFor")
    .populate("projects.projectDetails")
    .populate("invoiceCreatedBy");
  if (!invoice)
    next(new AppError("Invalid ObjectId! Please provide valid Id."));

  res.status(200).json({ status: "true", invoice });
});

const updateInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const userExists = await Invoice.findById({ _id: id, active: true });
  if (!userExists)
    next(new AppError("Invalid ObjectId! Please provide valid Id."));

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        receivedStatus: {
          amountReceived: updateData.amountReceived,
          receivedOn: updateData.receivedOn,
        },
      },
    },
    { new: true }
  )
    .populate("createdFor")
    .populate("projects.projectDetails")
    .populate("invoiceCreatedBy");
  // const updatedInvoice = await userExists({ ...userExists, updateData });
  console.log(updatedInvoice);

  res.status(200).json({ status: "true", updatedInvoice });
});

const deleteInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const userExists = await Invoice.findById({ _id: id });
  if (!userExists)
    next(new AppError("Invalid ObjectId! Please provide valid Id."));

  await Invoice.findByIdAndUpdate({ _id: id }, { $set: { active: false } });

  res.status(200).json({ status: "true", message: "Invoice deleted!" });
});

export {
  createInvoice,
  getAllInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
