import {
  setDate,
  setDueDate,
  setInvoiceNumber,
} from "@/components/store/invoice";
import { AppDispatch, AppState } from "@/components/store/store";
import { invoiceHistoryType, invoiceStateType } from "@/types/types";
import getFilteredInvoiceNumber, {
  generateInvoiceNumber,
  getLocalStorage,
} from "@/utils/invoiceNumber";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const InvoiceNumber = () => {
  const { Date: currentDate, DueDate } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { invoice } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;
  const dispatch = useDispatch<AppDispatch>();

  const [date, setdate] = useState<Date | null>(currentDate);
  const [dueDate, setdueDate] = useState<Date | null>(DueDate);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<
    number | string | any
  >("");
  const [error, setError] = useState<string>("");
  const [year] = useState<string | null>(
    typeof window !== "undefined" && window.localStorage
      ? getLocalStorage("year")
      : null
  );

  useEffect(() => {
    if (invoice.length !== 0) {
      if (year) {
        const filteredYear = getFilteredInvoiceNumber(invoice, year);
        if (filteredYear.length !== 0) {
          setLastInvoiceNumber(generateInvoiceNumber(filteredYear));
        } else setLastInvoiceNumber(`${localStorage.getItem("year")}001`);
      } else if (!getLocalStorage("year")) {
        localStorage.setItem(
          "year",
          invoice[invoice.length - 1]?.invoiceNumber.toString().slice(0, 4)
        );
        setLastInvoiceNumber(generateInvoiceNumber(invoice));
      }
    } else setLastInvoiceNumber("");
  }, [invoice, year]);

  useEffect(() => {
    setdate(new Date());
    const initialDueDate = new Date();
    initialDueDate.setDate(initialDueDate.getDate() + 5);
    setdueDate(initialDueDate);

    if (
      invoice.filter((invoice) => +invoice.invoiceNumber === lastInvoiceNumber)
        .length === 0
    ) {
      dispatch(setInvoiceNumber(lastInvoiceNumber));
      setError("");
    } else {
      setError("Invoice Number is already in use!");
      dispatch(setInvoiceNumber(""));
      return;
    }
    dispatch(setDate(date));
    dispatch(setDueDate(dueDate));
  }, [invoice, lastInvoiceNumber]);

  const handleDateChange = (selectedDate: Date) => {
    const newDueDate = new Date(selectedDate);
    newDueDate.setDate(selectedDate.getDate() + 5);

    setdate(selectedDate);
    setdueDate(newDueDate);
    dispatch(setDate(selectedDate));
    dispatch(setDueDate(newDueDate));
  };

  const handleDueDateChange = (selectedDate: Date) => {
    setdueDate(selectedDate);
    dispatch(setDueDate(selectedDate));
  };

  return (
    <div>
      <div className="w-[55%] pl-8">
        <div className="my-1 p-1 rounded-sm flex justify-between">
          <label
            htmlFor="invoice"
            className="font-semibold xs:text-xs sm:text-md md:text-sm"
          >
            Invoice Number:{" "}
          </label>
          <div className="w-1/2">
            <input
              type="text"
              id="invoice"
              className="bg-transparent outline-none border px-2 border-stone-300 p-1 rounded-sm xs:text-xs w-full sm:text-sm md:text-sm"
              value={`${getLocalStorage("year")}${lastInvoiceNumber
                .toString()
                .slice(4)}`}
              onChange={(e) => {
                setLastInvoiceNumber(+e.target.value);
              }}
            />
            {error && (
              <p className="text-red-500 text-[10pt] py-1 px-2 font-semibold">
                {error}
              </p>
            )}
          </div>
        </div>
        <div className="my-1 p-1 rounded-sm flex justify-between">
          <label
            htmlFor="date"
            className="font-semibold xs:text-xs sm:text-md md:text-sm cursor-pointer "
          >
            Date:{" "}
          </label>
          <input
            type="date"
            id="date"
            className="bg-transparent outline-none border px-2 border-stone-300 p-1 rounded-sm w-1/2 xs:text-xs sm:text-sm md:text-md"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const dateValue = new Date(e.target.value);
              handleDateChange(dateValue);
            }}
          />
        </div>
        <div className="my-1 p-1 rounded-sm flex justify-between">
          <label
            htmlFor="duedate"
            className="font-semibold xs:text-xs sm:text-md md:text-sm"
          >
            Due Date:{" "}
          </label>
          <input
            type="date"
            id="duedate"
            className=" cursor-pointer bg-transparent outline-none border px-2 border-stone-300 p-1 rounded-sm w-1/2 xs:text-xs sm:text-sm md:text-md"
            value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
            min={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const dateValue = new Date(e.target.value);
              handleDueDateChange(dateValue);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(InvoiceNumber);
