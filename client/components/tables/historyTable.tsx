import {
  PdfPreviewProps,
  invoiceHistoryType,
  invoiceType,
} from "@/types/types";
import { GrRotateRight } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { TbEditCircle } from "react-icons/tb";
import PdfPreview from "../generate-invoice/PdfPreview/PdfPreview";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  postInvoiceHistory,
  updateInvoice,
} from "../store/invoiceHistory";
import AlertDialogExample from "../alerts/AlertDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { setInvoiceNumber } from "../store/invoice";
import FullPageLoader from "../spinners/fullPageLoader";
import NotFound from "../alerts/notFound";
import { AgGridReact } from "ag-grid-react";
import { useInvoiceRowData } from "../hooks/useRowData";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import getFilteredInvoiceNumber, {
  generateInvoiceNumber,
  getLocalStorage,
} from "@/utils/invoiceNumber";
import { useRouter } from "next/router";

const HistoryTable = () => {
  const [pdfBlob, setPdfBlob] = useState<Blob | MediaSource>();
  const [pdfPreviewData, setpdfPreviewData] = useState<PdfPreviewProps | any>();
  const [isPreviewOpen, onPreviewClose] = useState(false);
  const [isEditOpen, onEditClose] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string>();
  const [date, setDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [amountReceived, setAmountReceived] = useState<number | string>(0);
  const [amountDate, setAmountDate] = useState<Date | null | any>(new Date());
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdateOpen, onUpdateOpen] = useState<boolean>(false);
  const [isAmountReceivedOpen, onAmountReceivedOpen] = useState<boolean>(false);

  // invoice number
  const { invoice, isLoading } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;
  const { historyRow } = useInvoiceRowData();
  const [_id, setId] = useState<string | any>(invoice[0]?._id);
  const [invoiceData, setInvoiceData] = useState<invoiceType>(
    invoice.filter((invoice) => invoice?._id === _id)[0]
  );

  const filterParams = {
    comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
      const dateAsString = cellValue;
      if (dateAsString == null) return -1;
      const dateParts = dateAsString.split("/");
      const cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2000,
    maxValidYear: new Date().getFullYear(),
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };

  const router = useRouter();

  const onRowClick = (params: any) => {
    const id = params?.data?._id;
    if (id) {
      +params.data.total - +params.data.totalAmountReceived === 0 ||
      -params?.data?.pendingAmount >
        params?.data?.total - params?.data?.totalAmountReceived
        ? localStorage.setItem("S", "Paid")
        : +params.data.daysLeft > 0
        ? localStorage.setItem("S", `Due By ${params.data.daysLeft} Days`)
        : +params.data.daysLeft === 0
        ? localStorage.setItem("S", "Due By Today")
        : localStorage.setItem("S", "Overdue");
      router.push(`/history/${id}`);
    }
  };

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
      cellRenderer: (params: any) => {
        return (
          <>
            {+params.data.total - +params.data.totalAmountReceived !== 0 &&
              +params.data?.pendingAmount > 0 &&
              +params.data.daysLeft < 0 && (
                <FontAwesomeIcon
                  icon={faCircle}
                  beatFade
                  className="text-red-600"
                />
              )}
            <p>{params.data.sno}</p>
          </>
        );
      },
    },
    {
      headerName: "Client",
      field: "client",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: "agTextColumnFilter",
      suppressMenu: true,
      floatingFilter: true,
      pinned: "left",
      lockPinned: true,
      cellRenderer: (params: any) => {
        return (
          <p
            onClick={() => {
              onRowClick(params);
            }}
            className="cursor-pointer"
          >
            {params.data?.client}
          </p>
        );
      },
    },
    {
      headerName: "Invoice ID",
      field: "invoiceNumber",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      width: 140,
    },
    // {
    //   headerName: "Projects",
    //   field: "projects",
    //   resizable: true,
    //   headerClass: "custom-header",
    //   cellClass: "centered-cell",
    //   filter: "agTextColumnFilter",
    //   suppressMenu: true,
    //   floatingFilter: true,
    // },
    {
      headerName: "Created On",
      field: "createdOn",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
      suppressMenu: true,
      floatingFilter: true,
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      resizable: true,
      headerClass: "custom-header",
      filter: "agDateColumnFilter",
      filterParams: filterParams,
      suppressMenu: true,
      floatingFilter: true,
      cellClass: "centered-cell",
    },
    {
      headerName: "Days Left",
      field: "daysLeft",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return +params.data.total - +params.data.totalAmountReceived === 0 ||
          -params?.data?.pendingAmount >
            params?.data?.total - params?.data?.totalAmountReceived ? (
          <p className="text-green-700 bg-green-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wide">
            Paid
          </p>
        ) : +params.data.daysLeft > 0 ? (
          <p className="text-purple-600 bg-purple-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wide">{`Due By ${params.data.daysLeft} Days`}</p>
        ) : +params.data.daysLeft === 0 ? (
          <p className="text-yellow-700 bg-yellow-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wide">
            Due By Today
          </p>
        ) : (
          <p className="text-red-600 bg-red-100 rounded-lg inline px-4 py-1 text-[9pt] tracking-wider">
            Overdue
          </p>
        );
      },
    },
    {
      headerName: "Subtotal",
      field: "subtotal",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <p className="">
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {params.data.subtotal.toLocaleString()}
          </p>
        );
      },
    },
    // {
    //   headerName: "GST",
    //   field: "gst",
    //   resizable: true,
    //   headerClass: "custom-header",
    //   filter: true,
    //   cellClass: "centered-cell",
    // },
    {
      headerName: "Total Amount",
      field: "total",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <p className="">
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {params.data.total.toLocaleString()}
          </p>
        );
      },
    },
    {
      headerName: "Amount Received",
      field: "amountReceived",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <div className="flex space-x-2 justify-center">
            {params.data?.amountReceived ? (
              <p>
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {params.data?.amountReceived
                  .reduce((acc: number, amount: any) => {
                    return (acc += amount.amountReceived);
                  }, 0)
                  .toLocaleString()}
              </p>
            ) : (
              <p>
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                <span>0</span>
              </p>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Pending Amount",
      field: "pendingAmount",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <p className="">
            <FontAwesomeIcon icon={faIndianRupeeSign} />
            {params?.data?.pendingAmount.toLocaleString()}
          </p>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      resizable: true,
      headerClass: "custom-header",
      filter: true,
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <>
            {+params?.data?.pendingAmount === 0 ? (
              <p className="text-green-700 bg-green-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wider">
                Cleared
              </p>
            ) : params?.data?.pendingAmount === params?.data?.total ? (
              <p className="text-orange-700 bg-orange-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wider">
                Raised
              </p>
            ) : params?.data?.pendingAmount > 0 &&
              params?.data?.pendingAmount < params?.data?.total ? (
              <p className="text-pink-700 bg-pink-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wider">
                Partially Paid
              </p>
            ) : (
              -params?.data?.pendingAmount >
                params?.data?.total - params?.data?.totalAmountReceived && (
                <p className="text-blue-700 bg-blue-100 rounded-lg inline px-4 py-1 text-[8pt] tracking-wider">
                  Overpaid
                </p>
              )
            )}
          </>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      headerClass: "custom-header",
      cellClass: "centered-cell",
      pinned: "right",
      resizable: true,
      lockPinned: true,
      width: 170,
      cellRenderer: (params: any) => (
        <div className="md:p-2 sm:pr-0 sm:pl-0 text-center cursor-pointer space-x-8 flex">
          <span className="block" title="Repeat">
            <GrRotateRight
              className="text-lg text-blue-700 bg-blue-100 rounded-full cursor-pointer"
              onClick={() => {
                setId(params?.data?._id);
                onEditClose(true);
              }}
            />
          </span>
          {/* <span title="Edit">
            <TbEditCircle
              className="text-xl text-slate-500 cursor-pointer"
              onClick={() => {
                setId(params?.data?._id);
                onUpdateOpen(true);
              }}
            />
          </span> */}
          <span className="block" title="Remove">
            <AiOutlineDelete
              className="text-lg text-red-500 bg-red-100 rounded-full cursor-pointer"
              onClick={() => {
                setId(params?.data?._id);
                setAlertOpen(true);
              }}
            />
          </span>
          <span title="Edit">
            <TbEditCircle
              className="text-lg text-indigo-500 bg-indigo-100 rounded-full cursor-pointer"
              onClick={() => {
                setId(params?.data?._id);
                onAmountReceivedOpen(true);
              }}
            />
          </span>
        </div>
      ),
    },
  ];
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      // flex: 1,
    }),
    []
  );
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);
  const pagination = true;
  const paginationPageSize = 15;

  const [error, setError] = useState<string>("");
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<number | string>(
    ""
  );

  const today = new Date().toISOString().split("T")[0];

  const [year] = useState<string | null>(
    typeof window !== "undefined" && window.localStorage
      ? getLocalStorage("year")
      : null
  );

  useEffect(() => {
    setInvoiceData(invoice.filter((invoice) => invoice?._id === _id)[0]);
  }, [_id, invoice]);

  useEffect(() => {
    if (invoice.length !== 0) {
      if (year) {
        const filteredYear = getFilteredInvoiceNumber(invoice, year);
        if (filteredYear.length !== 0) {
          setLastInvoiceNumber(generateInvoiceNumber(filteredYear));
        } else setLastInvoiceNumber(`${localStorage.getItem("year")}001`);
      } else
        !getLocalStorage("year") &&
          localStorage.setItem(
            "year",
            invoice[invoice.length - 1]?.invoiceNumber.toString().slice(0, 4)
          );
      setLastInvoiceNumber(generateInvoiceNumber(invoice));
    } else setLastInvoiceNumber("");
  }, [invoice, year]);

  useEffect(() => {
    if (isEditOpen) {
      setDate(new Date());
      const initialDueDate = new Date();
      initialDueDate.setDate(initialDueDate.getDate() + 5);
      setDueDate(initialDueDate);
    }

    if (
      invoice.filter((invoice) => +invoice.invoiceNumber === +lastInvoiceNumber)
        .length === 0
    ) {
      dispatch(setInvoiceNumber(lastInvoiceNumber));
      setError("");
    } else {
      setError("Invoice Number is already in use!");
      dispatch(setInvoiceNumber(""));
      return;
    }
  }, [invoice, lastInvoiceNumber, isEditOpen]);

  useEffect(() => {
    if (
      typeof invoiceData?.createdFor !== "string" &&
      invoiceData?.invoiceCreatedBy &&
      date &&
      dueDate
    ) {
      setpdfPreviewData({
        invoice: {
          invoice: invoiceData?.projects,
          invoiceType: invoiceData?.invoiceType,
          invoiceNumber: lastInvoiceNumber,
          Date: date,
          DueDate: dueDate,
        },
        user: {
          name: invoiceData?.invoiceCreatedBy?.name,
          email: invoiceData?.invoiceCreatedBy?.email,
          address: invoiceData?.invoiceCreatedBy?.address,
          contact: invoiceData?.invoiceCreatedBy?.contact,
          account: invoiceData?.invoiceCreatedBy?.account,
          pan: invoiceData?.invoiceCreatedBy?.pan,
          gstin: invoiceData?.invoiceCreatedBy?.gstin,
        },
        client: {
          name: invoiceData?.createdFor?.name,
          gstin: invoiceData?.createdFor?.gstin,
          address: invoiceData?.createdFor?.address,
        },
        total: {
          subtotal: invoiceData?.subtotal,
          GST: invoiceData?.GST,
          GrandTotal: invoiceData?.GrandTotal,
        },
      });
    }
  }, [
    date,
    dueDate,
    invoiceData?.GST,
    invoiceData?.GrandTotal,
    invoiceData?.createdFor,
    invoiceData?.createdOn,
    invoiceData?.dueDate,
    invoiceData?.invoiceCreatedBy,
    invoiceData?.invoiceNumber,
    invoiceData?.invoiceType,
    invoiceData?.projects,
    invoiceData?.subtotal,
    lastInvoiceNumber,
    invoiceData,
  ]);

  const generatePDF = async (e: FormEvent) => {
    e.preventDefault();

    if (lastInvoiceNumber !== "" && date && dueDate) {
      onPreviewClose(true);
      onEditClose(false);

      const pdfData = await pdf(<PdfPreview data={pdfPreviewData} />).toBlob();
      setPdfBlob(pdfData);
    } else toast.error("All fields are required!");
  };

  const downloadPDF = () => {
    if (pdfBlob) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "invoice.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    dispatch(
      postInvoiceHistory({
        createdFor: invoiceData?.createdFor?._id,
        invoiceNumber: lastInvoiceNumber.toString(),
        createdOn: date?.toLocaleDateString("en-GB"),
        dueDate: dueDate?.toLocaleDateString("en-GB"),
        projects: invoiceData?.projects?.map(
          (project: {
            id: any;
            projectDetails: { _id: any };
            period: any;
            workingDays: any;
            totalWorkingDays: any;
            hours: string;
            amount: string | number;
          }) => {
            return {
              id: project?.id,
              projectDetails: project?.projectDetails?._id,
              // description,
              period: project?.period,
              workingDays: project?.workingDays,
              totalWorkingDays: project?.totalWorkingDays,
              hours: project?.hours,
              amount: +project?.amount,
            };
          }
        ),
        subtotal: invoiceData?.subtotal,
        discount: invoiceData?.discount,
        tds: invoiceData?.tds,
        GST: invoiceData?.GST,
        GrandTotal: invoiceData?.GrandTotal,
        status: "raised",
        invoiceType: invoiceData?.invoiceType,
        active: true,
      })
    );
    onPreviewClose(false);
    setInvoiceNumber("");
    setDate(null);
    setDueDate(null);
  };

  const updateHandler = (e: FormEvent) => {
    e.preventDefault();
    // 12000 Wed Nov 15 2023 05:30:00 GMT+0530 (India Standard Time)
    if (invoiceData?._id)
      dispatch(
        updateInvoice({
          id: invoiceData?._id,
          dataToUpdate: { amountReceived: +amountReceived, amountDate },
        })
      );
  };

  //export invoice history to csv file
  const gridApiRef = useRef<any>(null);

  const onGridReady = (params: any) => {
    gridApiRef.current = params.api;
  };

  const onExportClick = () => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv();
    } else {
      console.error("Grid API is not initialized");
    }
  };

  return (
    <>
      {isLoading && <FullPageLoader />}
      {isLoading && invoice?.length ? (
        <NotFound
          title="Not Found"
          description="There are 0 projects. Please create project first!"
        />
      ) : (
        <>
          <div className="flex justify-between items-center px-4">
            <h1 className="font-semibold tracking-wider text-[#5a51be] text-xl">
              History
            </h1>
            <div className="flex justify-end my-8">
              <button
                className="cursor-pointer text-stone-600 bg-white border-[#e8e8ea] font-semibold hover:bg-slate-100 transition-all duration-75 ease-in-out border-2 px-4 py-1 rounded-sm tracking-wider"
                onClick={onExportClick}
              >
                Export
              </button>
            </div>
          </div>
          <div className="ag-theme-alpine" style={{ width: "100%" }}>
            <AgGridReact
              defaultColDef={defaultColDef}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              columnDefs={tableColumn} // header
              rowData={historyRow} // cells
              animateRows={true}
              domLayout="autoHeight"
              onGridReady={onGridReady}
              // onCellClicked={onRowClick}
            />
          </div>
        </>
      )}
      {isEditOpen && (
        <Modal isOpen={isEditOpen} onClose={() => onEditClose(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <form action="" onSubmit={generatePDF}>
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="font-semibold text-lg">
                    Invoice Number
                  </label>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Invoice Number"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                      maxLength={8}
                      value={`${
                        getLocalStorage("year") ||
                        invoice[invoice.length - 1].invoiceNumber.slice(0, 4)
                      }${lastInvoiceNumber.toString().slice(4)}`}
                      onChange={(e) => setLastInvoiceNumber(e.target.value)}
                    />
                    {error && (
                      <p className="text-red-500 text-[10pt] py-1 px-2 font-semibold">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="font-semibold text-lg">
                    Date
                  </label>
                  <input
                    type="date"
                    placeholder="Date"
                    className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    value={date ? date.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const dueDate = new Date(selectedDate);
                      dueDate.setDate(selectedDate.getDate() + 5);
                      setDate(selectedDate);
                      setDueDate(dueDate);
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="font-semibold text-lg">
                    Due Date
                  </label>
                  <input
                    type="date"
                    placeholder="Due Date"
                    className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                    min={date ? date.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        setDueDate(new window.Date(dateValue));
                      } else {
                        setDueDate(null);
                      }
                    }}
                    required
                  />
                </div>
                <ModalFooter>
                  <Button
                    className="bg-stone-200"
                    mr={3}
                    size={"sm"}
                    onClick={() => onEditClose(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#5a51be] text-stone-100 px-4 py-2 hover:bg-[#6960cc]"
                    size={"sm"}
                    colorScheme="purple"
                  >
                    Download PDF
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {/* {isUpdateOpen && (
        <Modal isOpen={isUpdateOpen} onClose={() => onUpdateOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <form action="" onSubmit={updateHandler} className="my-4">
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="font-semibold text-lg">
                    Status
                  </label>
                  <select
                    className="border-2 mt-2 px-4 py-2 rounded-sm outline-none bg-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="raised">Raised</option>
                    <option value="cleared">Cleared</option>
                  </select>
                </div>
                <ModalFooter>
                  <Button
                    className="bg-stone-200"
                    mr={3}
                    onClick={() => onUpdateOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#5a51be] text-stone-100 px-4 py-2 hover:bg-[#6960cc]"
                    colorScheme="purple"
                  >
                    Update
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )} */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => onPreviewClose(false)}
          size="4xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <PDFViewer width="100%" height="550em">
                <PdfPreview data={pdfPreviewData} />
              </PDFViewer>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-stone-200"
                mr={3}
                onClick={() => onPreviewClose(false)}
                size={"sm"}
              >
                Close
              </Button>
              <Button
                className="bg-[#5a51be] text-stone-100 px-4  hover:bg-[#6960cc]"
                onClick={downloadPDF}
                size={"sm"}
                colorScheme="purple"
              >
                Download PDF
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isAlertOpen && (
        <AlertDialogExample
          _id={invoiceData?._id || ""}
          isOpen={isAlertOpen}
          onClose={setAlertOpen}
          filter="invoiceDelete"
        />
      )}
      {isAmountReceivedOpen && (
        <Modal
          isOpen={isAmountReceivedOpen}
          onClose={() => onAmountReceivedOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <form action="" onSubmit={updateHandler} className="my-4">
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="text-base text-stone-700">
                    Enter Recieved Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Amount Recieved"
                    className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    value={amountReceived}
                    min={0}
                    // max={invoiceData?.GrandTotal}
                    step="0.01"
                    onChange={(e) => {
                      setAmountReceived(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col my-2">
                  <label htmlFor="" className="text-base text-stone-700">
                    Received On:
                  </label>
                  <input
                    type="date"
                    className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    value={
                      amountDate ? amountDate.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        setAmountDate(new window.Date(dateValue));
                      } else {
                        setAmountDate(null);
                      }
                    }}
                    required
                  />
                </div>
                <ModalFooter>
                  <Button
                    className="bg-stone-200"
                    mr={3}
                    onClick={() => onAmountReceivedOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#5a51be] text-stone-100 px-4 py-2 hover:bg-[#6960cc]"
                    colorScheme="purple"
                  >
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default HistoryTable;
