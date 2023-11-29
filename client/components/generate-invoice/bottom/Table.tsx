import { useEffect, useMemo, useState } from "react";
import CheckedModal from "@/components/modals/checkedModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/components/store/store";
import {
  clientStateType,
  clientType,
  invoiceStateType,
  userStateType,
} from "@/types/types";
import {
  calculateGST,
  calculateSubtotal,
  setisChecked,
  updatedChecked,
} from "@/components/store/invoice";
import { setDetailedProject } from "../../store/invoice";
import { AgGridReact } from "ag-grid-react";
import { useCheckedProjectRowData } from "@/components/hooks/useRowData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Table = () => {
  const { projects, clients } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const { invoiceType, isChecked, detailedProject } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { user, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;
  const { projectRow } = useCheckedProjectRowData();
  const dispatch = useDispatch<AppDispatch>();

  const [uniqueKey, setUniqueKey] = useState<string>("");

  useEffect(() => {
    const Projects =
      projects &&
      projects.map((project) => {
        return {
          _id: project._id,
          period: "",
          description: project.description,
          projectType: project.projectType,
          workingDays: "0",
          totalWorkingDays: "0",
          hours: "0.0",
          projectAmount: project.projectAmount,
          amount: "0,0.0",
          rate: project.rate,
          conversionRate: project.conversionRate,
          projectBelongsTo: project.projectBelongsTo,
          checked: false,
        };
      });

    if (Projects !== undefined) dispatch(setDetailedProject(Projects));
  }, [projects]);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
    }),
    []
  );

  const tableColumn: any = [
    {
      headerName: "S. No.",
      field: "sno",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      cellRenderer: (params: any) => (
        <>
          <label
            htmlFor="sno"
            className="flex items-center justify-center space-x-2"
          >
            <input
              type="checkbox"
              id="sno"
              className="outline-none accent-[#5a51be]"
              checked={
                detailedProject.filter((val) => val._id === params.data._id)[0]
                  ?.checked
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setUniqueKey(params.data?._id || "");
                  dispatch(setisChecked(true));
                  dispatch(
                    updatedChecked({
                      indx: params.data?._id || "",
                      checked: true,
                    })
                  );
                } else {
                  setisChecked(false);
                  dispatch(
                    updatedChecked({
                      indx: params.data?._id || "",
                      checked: false,
                    })
                  );

                  dispatch(
                    calculateSubtotal({
                      flag: undefined,
                      tds: clients.filter(
                        (client) => client._id === params.data?.projectBelongsTo
                      )[0]?.tds,
                    })
                  );
                }

                const clientState = clients.filter(
                  (client) => client._id === params.data?.projectBelongsTo
                )[0] as clientType;

                !isLoading &&
                  dispatch(
                    calculateGST({
                      userState: user.address.state,
                      clientState: clientState?.address?.state,
                    })
                  );
              }}
            />
            <span>{params.data.sno}</span>
          </label>
        </>
      ),
      width: 80,
    },
    {
      headerName: "Description",
      field: "description",
      cellClass: "centered-cell",
      resizable: true,
      headerClass: "custom-header",
    },
    {
      headerName: "Period",
      field: "period",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Working Days",
      field: "workingDays",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Total Working Days",
      field: "totalWorkingDays",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Rate",
      field: "rate",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Hours",
      field: "hours",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Conversion rate",
      field: "conversionRate",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Project Amount",
      field: "projectAmount",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "fixedbudget" ? false : true,
    },
    {
      headerName: "Amount",
      field: "amount",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
    },
  ];

  return (
    <>
      {projects?.length !== 0 && (
        <div className="ag-theme-alpine">
          <AgGridReact
            defaultColDef={defaultColDef}
            columnDefs={tableColumn} // header
            rowData={projectRow} // cells
            pagination={true}
            paginationPageSize={8}
            animateRows={true}
            domLayout="autoHeight"
          />
          {/* <table className="table-auto w-full rounded-md overflow-hidden">
            <thead>
              <tr className="border-2 border-[#9d96e4] bg-[#5a51be] text-stone-100">
                <th className="p-2"></th>
                <th className="p-2">S. No.</th>
                <th className="p-2">Description</th>
                {invoiceType === "monthly" ? (
                  <>
                    <th className="p-2">Period</th>
                    <th className="p-2">Working Days</th>
                    <th className="p-2">Total Working Days</th>
                  </>
                ) : invoiceType === "hourly" ? (
                  <>
                    <th className="p-2">Rate</th>
                    <th className="p-2">Hours</th>
                    <th className="p-2">Conversion Rate</th>
                  </>
                ) : invoiceType === "fixedbudget" ? (
                  <>
                    <th className="p-2">Project Amount</th>
                  </>
                ) : null }
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {projects &&
                projects
                  ?.filter((project) => project.projectType === invoiceType)
                  .map((project, indx) => {
                    return (
                      <>
                        <tr
                          key={project?._id}
                          className="border-2 border-[#9d96e4]"
                        >
                          <td className="border-2 border-[#9d96e4] text-center p-2">
                            <input
                              type="checkbox"
                              className="outline-none accent-[#5a51be]"
                              checked={
                                detailedProject.filter(
                                  (val) => val._id === project._id
                                )[0]?.checked
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setUniqueKey(project?._id || "");
                                  dispatch(setisChecked(true));
                                  dispatch(
                                    updatedChecked({
                                      indx: project?._id || "",
                                      checked: true,
                                    })
                                  );
                                } else {
                                  setisChecked(false);
                                  dispatch(
                                    updatedChecked({
                                      indx: project?._id || "",
                                      checked: false,
                                    })
                                  );
                                  dispatch(calculateSubtotal({flag: undefined}));
                                }

                                const clientState = clients.filter(
                                  (client) =>
                                    client._id === project?.projectBelongsTo
                                )[0] as clientType;

                                !isLoading &&
                                  dispatch(
                                    calculateGST({
                                      userState: user.address.state,
                                      clientState: clientState?.address?.state,
                                    })
                                  );
                              }}
                            />
                          </td>
                          <TableTr
                            key={project._id}
                            indx={indx}
                            project={project}
                          />
                        </tr>
                      </>
                    );
                  })}
            </tbody>
          </table> */}
          {isChecked && <CheckedModal key={uniqueKey} uniqueKey={uniqueKey} />}
        </div>
      )}
    </>
  );
};

export default Table;
