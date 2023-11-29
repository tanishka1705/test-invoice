import Organization from "../models/company-model";
import Project from "../models/project-model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const createCompany = catchAsync(async (req, res, next) => {
  const { name, gstin, tds, address, active } = req.body;

  const org = await Organization({
    name,
    gstin,
    tds,
    address,
    active,
    companyCreatedBy: req.user._id,
  });

  const { error } = org.orgValidator(req.body);

  if (error) {
    const msg = error.details.map((err) => err.message).join(", ");
    return next(new AppError(msg));
  }

  const newOrg = await org.save();
  res
    .status(201)
    .json({ status: "true", message: `Registered successfully!`, new: newOrg });
});

const getAllListedCompanies = catchAsync(async (req, res, next) => {
  const getAll = await Organization.find({ companyCreatedBy: req.user._id });

  if (getAll.length === 0)
    return next(new AppError(`There are no listed companies!`, 404));

  res
    .status(200)
    .json({
      status: "true",
      allListedCompanies: getAll.filter((client) => client?.active === true),
    });
});

const getCompanyByID = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const searchResult = await Organization.find({
    companyCreatedBy: req.user._id,
    _id: id,
  }).populate("projects");

  if (!searchResult)
    return next(new AppError("Not Found!, Please check company_id", 404));

  res.status(200).json({ status: "true", companyDetail: searchResult });
});

const getProjectsOfCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const projects = await Organization.find({
    companyCreatedBy: req.user._id,
    _id: id,
  }).populate("projects");

  if (projects.length === 0)
    return next(new AppError(`There are no listed companies!`, 404));

  res.status(200).json({ status: "true", allListedProjects: projects });
});

const updateCompanyById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const prevDocument = await Organization.findOne({
    companyCreatedBy: req.user._id,
    _id: id,
  });

  if (!prevDocument)
    return next(new AppError("Not Found! Please check company_id", 404));

  const fieldsToUpdate = {
    name: prevDocument.name,
    gstin: prevDocument.gstin,
    address: prevDocument.address,
  };

  for (const key in updateData) {
    if (key === "address" && typeof updateData.address === "object") {
      for (const addressKey in updateData.address) {
        fieldsToUpdate[key][addressKey] = updateData.address[addressKey];
      }
    } else {
      fieldsToUpdate[key] = updateData[key];
    }
  }

  const updateResult = await Organization.findByIdAndUpdate(
    { _id: id },
    { $set: fieldsToUpdate },
    { new: true }
  );

  res.status(200).json({ status: "true", updatedCompany: updateResult });
});

const deleteCompanyById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const isExists = await Organization.findOne({
    companyCreatedBy: req.user._id,
    _id: id,
  });
  if (!isExists)
    return next(new AppError("Not Exists! Please check company_id", 400));

  const deletedData = await Organization.findByIdAndUpdate(
    { _id: id },
    { $set: { active: false } }
  );
  deletedData.projects.map(
    async (project) =>
      await Project.findByIdAndUpdate(
        { _id: project._id },
        { $set: { active: false } }
      )
  );

  res.status(200).json({ status: "true", message: "Deleted successfully!" });
});

export {
  createCompany,
  getAllListedCompanies,
  getCompanyByID,
  getProjectsOfCompany,
  updateCompanyById,
  deleteCompanyById,
};
