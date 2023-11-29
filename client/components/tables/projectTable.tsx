import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import { invoiceStateType, projectStateType } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faTrash,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import NotFound from "../alerts/notFound";
import { useCallback, useMemo, useState } from "react";
import UpdateProjectModal from "../modals/updateProjectModal";
import AlertDialogExample from "../alerts/AlertDialog";
import FullPageLoader from "../spinners/fullPageLoader";
import { AgGridReact } from "ag-grid-react";
import { useCheckedProjectRowData, useProjectRowData } from "../hooks/useRowData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { TbEditCircle } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";

const ProjectTable = () => {
  const [_id, setId] = useState("");
  const [cid, setcid] = useState("");

  const projects = useSelector<AppState>(
    (state) => state.project
  ) as projectStateType;
  const { invoiceType, isChecked, detailedProject } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { projectRow } = useProjectRowData();
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const tableColumn: any = [
    {
      headerName: "S. No.",
      field: "sno",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      width: 80,
      pinned: "left",
      lockPinned: true,
    },
    {
      headerName: "Description",
      field: "description",
      resizable: true,
      headerClass: "custom-header",
      pinned: "left",
      lockPinned: true,
      filter: "agTextColumnFilter",
      suppressMenu: true,
      floatingFilter: true,
    },
    {
      headerName: "Client",
      field: "client",
      resizable: true,
      headerClass: "custom-header",
      filter: "agTextColumnFilter",
      suppressMenu: true,
      floatingFilter: true,
      cellClass: "centered-cell",
    },
    {
      headerName: "Project type",
      field: "projectType",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: "agTextColumnFilter",
      suppressMenu: true,
      floatingFilter: true,
    },
    {
      headerName: "Project amount",
      field: "projectAmount",
      resizable: true,
      headerClass: "custom-header",
      suppressMenu: true,
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => (
        <>
          {params.data?.projectAmount !== "N/A" ? (
            <div className="flex items-center justify-center space-x-1">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
              <p>{params.data?.projectAmount}</p>
            </div>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      headerName: "Project Cycle",
      field: "projectCycle",
      resizable: true,
      headerClass: "custom-header",
      suppressMenu: true,
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      cellClass: "centered-cell",
    },
    {
      headerName: "Rate",
      field: "rate",
      resizable: true,
      headerClass: "custom-header",
      suppressMenu: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" || invoiceType == "monthly" || invoiceType == '' ? false: true,
    },
    {
      headerName: "Conversion rate",
      field: "conversionRate",
      resizable: true,
      headerClass: "custom-header",
      suppressMenu: true,
      filter: "agNumberColumnFilter",
      floatingFilter: true,
      cellClass: "centered-cell",
    },
    {
      headerName: "Actions",
      field: "actions",
      headerClass: "custom-header",
      cellClass: "centered-cell",
      pinned: "right",
      lockPinned: true,
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center cursor-pointer justify-between">
          <TbEditCircle
            icon={faUserPen}
            style={{ color: "#5d6f99" }}
            className="text-xl mt-2 text-indigo-500 bg-indigo-100 rounded-full cursor-pointer"
            onClick={() => {
              setUpdateOpen(true);
              setId(params?.data?._id);
            }}
          />
          <AiOutlineDelete
            icon={faTrash}
            style={{ color: "rgb(247 43 43)" }}
            className="text-xl mt-2 text-red-500 bg-red-100 rounded-full cursor-pointer"
            onClick={() => {
              setDeleteOpen(true);
              setId(params?.data?._id);
            }}
          />
        </div>
      ),
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );
  const pagination = true;
  const paginationPageSize = 8;

  return (
    <>
      {projects.isLoading && <FullPageLoader />}
      {!projects.isLoading && !projects?.projects?.length ? (
        <NotFound
          title="Not Found"
          description="There are 0 projects. Please create project first!"
        />
      ) : (
        <div className="ag-theme-alpine" style={{ width: "100%" }}>
          <AgGridReact
            defaultColDef={defaultColDef}
            columnDefs={tableColumn} // header
            rowData={projectRow} // cells
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            animateRows={true}
            domLayout="autoHeight"
          />
        </div>
      )}
      <UpdateProjectModal
        isOpen={updateOpen}
        onClose={setUpdateOpen}
        _id={_id}
      />
      <AlertDialogExample
        isOpen={deleteOpen}
        onClose={setDeleteOpen}
        filter="projectDelete"
        _id={_id}
        cid={cid}
      />
    </>
  );
};

export default ProjectTable;
