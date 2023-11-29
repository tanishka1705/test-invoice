import Layout from "@/components/layout/Layout";
import FullPageLoader from "@/components/spinners/fullPageLoader";
import { getInvoiceById } from "@/components/store/invoiceHistory";
import { AppDispatch, AppState } from "@/components/store/store";
import { invoiceHistoryType } from "@/types/types";
import {
  faArrowDown,
  faCaretUp,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useDetailedInvoice } from "@/components/hooks/useRowData";
import setTableColumn from "@/utils/projectTableColumn";
import { getStandardDate } from "@/utils/getFormatDate";

function InvoiceHistoryDetail() {
  const router = useRouter();
  const rowID = router.query.id as string;
  const { invoiceById, isLoading, invoice } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;
  const dispatch = useDispatch<AppDispatch>();
  const [history, setHistory] = useState<
    invoiceHistoryType["invoiceById"]["receivedStatus"]
  >([]);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState<string | undefined>("");

  useEffect(() => {
    if (rowID) {
      dispatch(getInvoiceById(rowID));
      setInvoiceStatus(localStorage.getItem("S") || "");
    }
  }, [rowID]);

  useEffect(() => {
    setHistory(() => invoiceById?.receivedStatus?.slice(0, 3));
    invoiceById?.receivedStatus &&
      setTotalAmountReceived(
        invoiceById?.receivedStatus?.reduce(
          (acc, amount) => (acc += amount.amountReceived),
          0
        )
      );
  }, [invoiceById?.receivedStatus]);

  const { projectRow } = useDetailedInvoice();
  const loadMore = () => {
    const currentLength = history?.length;
    const nextItems =
      currentLength &&
      invoiceById?.receivedStatus?.slice(currentLength, currentLength + 3);

    nextItems && history && setHistory([...history, ...nextItems]);
  };

  const tableColumn = setTableColumn(invoiceById.invoiceType);
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      flex: 1,
    }),
    []
  );

  return (
    <Layout>
      <div className="flex justify-between items-center px-4">
        <div className="flex justify-end my-6">
          <h1 className="font-semibold tracking-wider text-[#5a51be] text-xl ml-2">
            Invoice Details
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 m-6">
        <div className="bg-white p-4 col-span-9 h-fit rounded-tl-md rounded-bl-md rounded-tr-md rounded-br-md relative">
          <div className="badge badge-top-right">
            <span
              className={`tracking-wider uppercase text-center text-white block absolute font-semibold ${
                invoiceStatus?.toLocaleLowerCase() === "paid"
                  ? "bg-green-600"
                  : invoiceStatus?.toLocaleLowerCase() === "due by today"
                  ? "bg-yellow-500 !text-[11pt]"
                  : invoiceStatus?.toLocaleLowerCase() == "overdue"
                  ? " bg-red-500"
                  : "bg-[#5a51be] !text-[10pt]"
              }`}
            >
              {invoiceStatus}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <h1 className="font-semibold tracking-wider text-[#0c0c0f] text-lg mt-2">
              INVOICE NUMBER:{" "}
              <span className="font-semibold tracking-wider text-[#5a51be] text-lg mt-2">
                {invoiceById?.invoiceNumber}
              </span>
            </h1>
          </div>
          {isLoading ? (
            <FullPageLoader />
          ) : (
            <div className="grid grid-cols-2 gap-5 mt-8">
              <div>
                <h2 className="text-[#898991] text-lg mt-2">Billing From:</h2>
                <h2 className="uppercase font-semibold tracking-wider text-[#101011] text-sm mt-2">
                  {invoiceById?.invoiceCreatedBy?.name}
                </h2>
                <p className="text-[#898991] text-sm mt-2">
                  GSTIN:{" "}
                  <span className="uppercase">
                    {invoiceById?.invoiceCreatedBy?.gstin}
                  </span>
                </p>
                <p className="text-[#898991] text-sm mt-2">
                  PAN:{" "}
                  <span className="uppercase">
                    {invoiceById?.invoiceCreatedBy?.pan}
                  </span>
                </p>
                <p className="text-[#898991] text-sm mt-2">
                  {`${invoiceById?.invoiceCreatedBy?.address.street},`}{" "}
                </p>
                <p className="text-[#898991] text-sm">{`${invoiceById?.invoiceCreatedBy?.address.city} ${invoiceById?.invoiceCreatedBy?.address.pin}, 
                                 ${invoiceById?.invoiceCreatedBy?.address.state}, ${invoiceById?.invoiceCreatedBy?.address.country}`}</p>
                <p className="text-[#898991] text-sm'">
                  <span className="underline text-blue-500">
                    {invoiceById?.invoiceCreatedBy?.email}
                  </span>
                  <span> | </span>
                  <span>+91-{invoiceById?.invoiceCreatedBy?.contact}</span>
                </p>
              </div>

              <div className=" ml-36">
                <h2 className="text-[#898991] text-lg mt-2">Billing To:</h2>
                <h2 className="font-semibold tracking-wider text-[#101011] text-md mt-2">
                  {invoiceById?.createdFor?.name}
                </h2>
                <p className="text-[#898991] text-sm mt-2">
                  GSTIN: {invoiceById?.createdFor?.gstin}
                </p>
                <p className="text-[#898991] text-sm mt-2">
                  {`${invoiceById?.createdFor?.address?.street}, ${invoiceById?.createdFor?.address?.city} `}{" "}
                </p>
                <p className="text-[#898991] text-sm">{`${invoiceById?.createdFor?.address?.pin} ${invoiceById?.createdFor?.address?.state}, ${invoiceById?.createdFor?.address?.country}`}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-5 mt-8">
            <div>
              <h2 className="font-semibold tracking-wider text-[#676769] text-md mt-2">
                Invoice Type:
              </h2>
              <p className="text-lg mt-1">{invoiceById?.invoiceType}</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-wider text-[#676769] text-md mt-2">
                Created on:
              </h2>
              <p className="text-lg mt-1">{invoiceById?.createdOn}</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-wider text-[#676769] text-md mt-2">
                Due Date:
              </h2>
              <p className="text-lg mt-1">{invoiceById?.dueDate}</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-wider text-[#676769] text-md mt-2">
                Bill Amount:
              </h2>
              <p className="text-lg mt-1">
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {invoiceById?.GrandTotal}
              </p>
            </div>
          </div>

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
          </div>

          <div className="grid grid-cols-2 gap-5 mt-8">
            <div className=" mt-3">
              <h2 className="uppercase font-semibold tracking-wider text-[#101011] text-sm mt-2">
                Total Amount: 345334
              </h2>
              <h2 className="uppercase font-semibold tracking-wider text-[#101011] text-sm mt-2">
                Amount Received: 833583
              </h2>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-2"></div>
              <div className=" col-span-10">
                <div className="flex justify-between space-x-12 font-semibold my-2">
                  <h1 className="text-sm">Sub Total :</h1>
                  <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                    {invoiceById?.subtotal !== 0
                      ? invoiceById?.subtotal
                      : "0,0.0"}{" "}
                  </h5>
                </div>
                {invoiceById?.discount ? (
                  <div className="flex justify-between space-x-12 font-semibold my-2">
                    <h1 className="text-sm">Discount :</h1>
                    <h5 className="bg-stone-100 text-stone-800 rounded-md text-sm text-start focus:border-gray-400 outline-none py-2 px-8 w-1/2">
                      {invoiceById?.discount}
                    </h5>
                  </div>
                ) : ''}
                <div className="flex justify-between space-x-12 font-semibold my-2">
                  <h1 className="text-sm">TDS :</h1>
                  <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
                    {invoiceById.createdFor?.tds !== 0
                      ? invoiceById.createdFor?.tds
                      : "0"}
                    {"%"}
                  </h5>
                </div>
                {typeof invoiceById?.GST === "object" ? (
                  <>
                    <div className="flex justify-between space-x-12 font-semibold my-2">
                      <h1 className="text-sm">CGST@ 9% :</h1>
                      <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                        {invoiceById?.GST.CGST !== 0
                          ? invoiceById?.GST.CGST
                          : "0,0.0"}{" "}
                      </h5>
                    </div>
                    <div className="flex justify-between space-x-12 font-semibold my-2">
                      <h1 className="text-sm">SGST@ 9% :</h1>
                      <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                        {invoiceById?.GST.SGST !== 0
                          ? invoiceById?.GST.SGST
                          : "0,0.0"}{" "}
                      </h5>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between space-x-12 font-semibold my-2">
                    <h1 className="text-sm">GST@ 18% :</h1>
                    <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
                      <FontAwesomeIcon icon={faIndianRupeeSign} />
                      {typeof invoiceById?.GST === "number" &&
                      invoiceById?.GST !== 0
                        ? invoiceById?.GST
                        : "0,0.0"}{" "}
                    </h5>
                  </div>
                )}
                <div className="flex justify-between my-2">
                  <h1 className="text-stone-800 py-2 rounded-md text-sm font-semibold text-start">
                    TOTAL :
                  </h1>
                  <h5 className="bg-[#5a51be] text-stone-100 px-8 py-2 rounded-md text-md font-semibold text-start w-1/2">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                    {invoiceById?.GrandTotal !== 0
                      ? invoiceById?.GrandTotal
                      : "0,0.0"}{" "}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 col-span-3 rounded-tl-md rounded-bl-md rounded-tr-md rounded-br-md h-fit">
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-12 border-b-2 border-b-slate-100 pb-4 mb-8">
              <div className="col-span-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  className="svg-primary text-indigo-600 fill-indigo-800 bg-indigo-100 w-10 p-2 rounded-md"
                >
                  <path d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"></path>
                </svg>
              </div>
              <div className="col-span-9">
                <p className="text-sm capitalize tracking-wider text-stone-700">
                  total invoice amount
                </p>
                <h1 className="text-stone-800 font-bold tracking-wide flex items-center space-x-1">
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  <span>{invoiceById?.GrandTotal.toLocaleString()}</span>
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-12 border-b-2 border-b-slate-100 pb-4 mb-8">
              <div className="col-span-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="svg-primary text-green-600 fill-green-500 bg-green-100 w-10 p-2 rounded-md"
                >
                  <path d="M11.5,20h-6a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h5V7a3,3,0,0,0,3,3h3v5a1,1,0,0,0,2,0V9s0,0,0-.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.29.29,0,0,0-.1,0A1.1,1.1,0,0,0,11.56,2H5.5a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h6a1,1,0,0,0,0-2Zm1-14.59L15.09,8H13.5a1,1,0,0,1-1-1ZM7.5,14h6a1,1,0,0,0,0-2h-6a1,1,0,0,0,0,2Zm4,2h-4a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-4-6h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm13.71,6.29a1,1,0,0,0-1.42,0l-3.29,3.3-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,21.21,16.29Z" />
                </svg>
              </div>

              <div className="col-span-9">
                <p className="text-sm capitalize tracking-wider text-stone-700">
                  total amount received
                </p>
                <h1 className="text-stone-800 font-bold tracking-wide flex items-center space-x-1">
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  <span>{totalAmountReceived.toLocaleString()}</span>
                </h1>
                <div className="w-[80%] bg-gray-200 rounded-full mt-2 h-1.5 dark:bg-stone-200">
                  <div
                    className="bg-[#5a51be] h-1.5 rounded-full dark:bg[#5a51be]"
                    style={{
                      width:
                        (totalAmountReceived / invoiceById?.GrandTotal) * 100 >=
                        100
                          ? "100%"
                          : (totalAmountReceived / invoiceById?.GrandTotal) *
                            100,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 border-b-2 border-b-slate-100 pb-4 mb-8">
              <div className="col-span-3 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  viewBox="0 0 24 24"
                  className="svg-primary text-yellow-500 fill-yellow-500 bg-yellow-100 w-10 p-2 rounded-md"
                >
                  <path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z" />
                </svg>
              </div>
              <div className="col-span-9">
                <p className="text-sm capitalize tracking-wider text-stone-700">
                  amount received history
                </p>
                {invoiceById.receivedStatus ? (
                  <>
                    <div className="overflow-x-scroll scroller">
                      {history?.map((payment) => (
                        <div
                          className="flex items-center space-x-2 w-[115%] my-1"
                          key={payment?.amountReceived}
                        >
                          <FontAwesomeIcon
                            icon={faCaretUp}
                            className=" text-emerald-500"
                          />
                          <h1 className="text-stone-800 font-bold text-base tracking-wide flex items-center space-x-1">
                            <FontAwesomeIcon icon={faIndianRupeeSign} />
                            <span>
                              {payment?.amountReceived.toLocaleString()}
                            </span>
                          </h1>
                          <span className="text-sm font-semibold">on</span>
                          <h1 className="text-sm">
                            {payment?.receivedOn &&
                              getStandardDate(payment?.receivedOn)}
                          </h1>
                        </div>
                      ))}
                    </div>
                    {invoiceById?.receivedStatus?.length !==
                      history?.length && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => loadMore()}
                          className="bg-[#5a51be] text-white w-7 h-7 rounded-full font-semibold text-sm underline text-center my-2 hover:pt-1 transition-all delay-100 ease-linear"
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    Not received payment yet!
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 border-b-2 border-b-slate-100 pb-4 mb-8">
            <div className="col-span-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                viewBox="0 0 24 24"
                className="svg-primary text-red-500 fill-red-500 bg-red-100 w-10 p-2 rounded-md"
              >
                <path d="M19,12h-7V5c0-0.6-0.4-1-1-1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9C20,12.4,19.6,12,19,12z M12,19.9c-3.8,0.6-7.4-2.1-7.9-5.9C3.5,10.2,6.2,6.6,10,6.1V13c0,0.6,0.4,1,1,1h6.9C17.5,17.1,15.1,19.5,12,19.9z M15,2c-0.6,0-1,0.4-1,1v6c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1C22,5.1,18.9,2,15,2z M16,8V4.1C18,4.5,19.5,6,19.9,8H16z" />
              </svg>
            </div>
            <div className="col-span-9">
              <p className="text-sm capitalize tracking-wider text-stone-700">
                total amount pending
              </p>
              <h1 className="text-stone-800 font-bold tracking-wide flex items-center space-x-1">
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                <span>
                  {invoiceById?.GrandTotal - totalAmountReceived === 0 ||
                  invoiceById?.GrandTotal - totalAmountReceived < 0
                    ? 0
                    : (totalAmountReceived - invoiceById?.GrandTotal).toFixed(
                        2
                      )}
                </span>
              </h1>
            </div>
          </div>
          {invoiceById?.GrandTotal - totalAmountReceived < 0 && (
            <div className="grid grid-cols-12 border-b-2 border-b-slate-100 pb-4 mb-8">
              <div className="col-span-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="svg-primary text-blue-500 fill-blue-500 bg-blue-100 w-10 p-2 rounded-md"
                >
                  <path d="M11.5,20h-6a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h5V7a3,3,0,0,0,3,3h3v5a1,1,0,0,0,2,0V9s0,0,0-.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.29.29,0,0,0-.1,0A1.1,1.1,0,0,0,11.56,2H5.5a3,3,0,0,0-3,3V19a3,3,0,0,0,3,3h6a1,1,0,0,0,0-2Zm1-14.59L15.09,8H13.5a1,1,0,0,1-1-1ZM7.5,14h6a1,1,0,0,0,0-2h-6a1,1,0,0,0,0,2Zm4,2h-4a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-4-6h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm13.71,6.29a1,1,0,0,0-1.42,0l-3.29,3.3-1.29-1.3a1,1,0,0,0-1.42,1.42l2,2a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,21.21,16.29Z" />
                </svg>
              </div>
              <div className="col-span-9">
                <p className="text-sm capitalize tracking-wider text-stone-700">
                  Overpaid Amount
                </p>
                <h1 className="text-stone-800 font-bold tracking-wide flex items-center space-x-1">
                  <FontAwesomeIcon icon={faIndianRupeeSign} />
                  <span>
                    {invoiceById?.GrandTotal - totalAmountReceived < 0 &&
                      (totalAmountReceived - invoiceById?.GrandTotal)
                        .toFixed(2)
                        .toLocaleString()}
                  </span>
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default InvoiceHistoryDetail;
