import { AppState } from "@/components/store/store";
import { dataProps, invoiceStateType, projectType } from "@/types/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  project: projectType;
  indx: number;
}

const TableTr = ({ project, indx }: Props) => {
  const { invoiceType, detailedProject } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const [filteredProject, setFilteredProject] = useState<dataProps>();

  useEffect(() => {
    setFilteredProject(
      detailedProject.filter((val) => val._id === project?._id)[0]
    );
  }, [detailedProject, project._id]);

  return (
    <>
      <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
        {indx + 1}
      </td>
      <td className="border-2 border-[#9d96e4] px-4 py-1">
        {filteredProject?.description}
      </td>
      {invoiceType === "monthly" ? (
        <>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {filteredProject?.period !== "" ? (
              filteredProject?.period
            ) : (
              <span className="text-slate-400 select-none">Miscellaneous</span>
            )}
          </td>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {filteredProject?.workingDays}
          </td>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {filteredProject?.totalWorkingDays}
          </td>
        </>
      ) : invoiceType === "hourly" ? (
        <>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {/* {project?.rate?.rate} {project?.rate?.currency}/Hour */}
            {`${filteredProject?.rate?.rate} ${
              project?.rate?.currency === "USD"
                ? "$"
                : project?.rate?.currency === "POUND"
                ? "£"
                : project?.rate?.currency === "INR"
                ? "INR"
                : ""
            } / Hour`}
          </td>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {filteredProject?.hours}
          </td>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {project?.rate?.currency === "USD" ? (
              `1$ = ${filteredProject?.conversionRate} INR`
            ) : project?.rate?.currency === "POUND" ? (
              `1£ = ${filteredProject?.conversionRate} INR`
            ) : project?.rate?.currency === "INR" ? (
              <span className="text-red-500 font-semibold">N/A</span>
            ) : (
              ""
            )}
          </td>
        </>
      ) : invoiceType === "fixedbudget" ? (
        <>
          <td className="border-2 border-[#9d96e4] px-4 py-1 text-center">
            {filteredProject?.projectAmount} INR
          </td>
        </>
      ) : null}
      <td className="border-2 border-[#9d96e4] px-4 py-1 text-center font-semibold">
        {/* INR {filteredProject?.amount} */}
        INR{" "}
        {invoiceType === "fixedbudget"
          ? filteredProject?.projectAmount
          : filteredProject?.amount}
      </td>
    </>
  );
};

export default TableTr;
