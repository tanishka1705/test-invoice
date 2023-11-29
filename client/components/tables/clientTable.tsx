import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import { clientStateType, clientType } from "@/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import NotFound from "../alerts/notFound";
import { useMemo, useState } from "react";
import AlertDialogExample from "../alerts/AlertDialog";
import UpdateClientModal from "../modals/updateClientModal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import useRowData from "../hooks/useRowData";
import { TbEditCircle } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";

const ClientTable = () => {
  const clients = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const { clientRow } = useRowData();

  const [_id, setId] = useState<string | any>(clients?.clients[0]?._id);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const pagination = true;
  const paginationPageSize = 8;

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      // flex: 1
    }),
    []
  );

  const tableColumn: any = [
    {
      headerName: "S. No.",
      field: "sno",
      resizable: true,
      // headerClass: "custom-header",
      cellClass: "centered-cell",
      width: 100,
      pinned: 'left',
      lockPinned: true,
    },
    {
      headerName: "Client",
      field: "client",
      resizable: true,
      // headerClass: "custom-header",
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilter: true,
      pinned: 'left',
      lockPinned: true,
      width: 260,
    },
    {
      headerName: "GSTIN",
      field: "gstin",
      resizable: true,
      // headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilter: true
    },
    // work pending of tds...
    {
      headerName: "TDS",
      field: "tds",
      resizable: true,
      // headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilter: true
    },
    {
      headerName: "Address",
      field: "address",
      resizable: true,
      width: 350,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilter: true,
      // headerClass: "custom-header",
      cellClass: "centered-cell",
    },
    {
      headerName: "Projects",
      field: "projects",
      resizable: true,
      // headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: 'agNumberColumnFilter',
      suppressMenu: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      // headerClass: "custom-header",
      pinned: 'right',
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

  return (
    <>
      {!clientRow?.length ? (
        <NotFound title="Not Found" description="Please Add Client First!" />
      ) : (
        <>
          <div className="ag-theme-alpine" style={{ width: "100%" }}>
            <AgGridReact
              defaultColDef={defaultColDef}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              columnDefs={tableColumn} // header
              rowData={clientRow} // cells
              animateRows={true}
              domLayout="autoHeight"
            />
          </div>
          <UpdateClientModal
            isOpen={updateOpen}
            onClose={setUpdateOpen}
            _id={_id}
          />
          <AlertDialogExample
            isOpen={deleteOpen}
            onClose={setDeleteOpen}
            filter="clientDelete"
            _id={_id}
          />
        </>
      )}
    </>
  );
};

export default ClientTable;
