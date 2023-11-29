import {
  calculateGST,
  calculateSubtotal,
  setDiscount,
} from "@/components/store/invoice";
import { AppDispatch, AppState } from "@/components/store/store";
import { clientStateType, invoiceStateType } from "@/types/types";
import { faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PdfPreview from "../PdfPreview/PdfPreview";

const Total = () => {
  const { subtotal, GST, GrandTotal } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { clientById } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const dispatch = useDispatch<AppDispatch>();

  const [discount, setdiscount] = useState<string | number>("");
  const [discountedSubtotal, setDiscountedSubtotal] = useState(subtotal);

  useEffect(() => {
    if (discount) {
      dispatch(
        calculateSubtotal({
          flag: true,
          discount: discountedSubtotal,
          tds: clientById?.tds,
        })
      );
      dispatch(calculateGST({ userState: "", clientState: "" }));
    } else {
      dispatch(calculateSubtotal({ flag: false, tds: clientById?.tds }));
      dispatch(calculateGST({ userState: "", clientState: "" }));
    }
  }, [discountedSubtotal, discount, clientById?.tds]);

  return (
    <div className="w-[35%]">
      <div className="flex justify-between space-x-12 font-semibold my-2">
        <h1 className="text-sm">Sub Total :</h1>
        <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
          {subtotal !== 0 ? subtotal : "0,0.0"}{" "}
          <FontAwesomeIcon icon={faRupeeSign} />
        </h5>
      </div>
      <div className="flex justify-between space-x-12 font-semibold my-2">
        <h1 className="text-sm">Avail Discount :</h1>
        <input
          type="number"
          placeholder="0%"
          min={0}
          max={100}
          step={2}
          className="bg-stone-100 text-stone-800 rounded-md text-sm text-start focus:border-gray-400 outline-none py-2 px-8 w-1/2"
          value={discount}
          onChange={(e: any) => {
            if (+e.target.value < 0 || +e.target.value > 100) return;
            setdiscount(e.target.value);
            dispatch(setDiscount(+e.target.value));
            const discountValue = (+e.target.value / 100) * subtotal;
            const updatedDiscountedSubtotal = subtotal - discountValue;
            setDiscountedSubtotal(updatedDiscountedSubtotal);
          }}
        />
      </div>
      <div className="flex justify-between space-x-12 font-semibold my-2">
        <h1 className="text-sm">TDS :</h1>
        <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
          {clientById?.tds !== 0 ? clientById?.tds : "0"}
          {"%"}
        </h5>
      </div>
      {typeof GST === "object" ? (
        <>
          <div className="flex justify-between space-x-12 font-semibold my-2">
            <h1 className="text-sm">CGST@ 9% :</h1>
            <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
              {GST.CGST !== 0 ? GST.CGST : "0,0.0"}{" "}
              <FontAwesomeIcon icon={faRupeeSign} />
            </h5>
          </div>
          <div className="flex justify-between space-x-12 font-semibold my-2">
            <h1 className="text-sm">SGST@ 9% :</h1>
            <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
              {GST.SGST !== 0 ? GST.SGST : "0,0.0"}{" "}
              <FontAwesomeIcon icon={faRupeeSign} />
            </h5>
          </div>
        </>
      ) : (
        <div className="flex justify-between space-x-12 font-semibold my-2">
          <h1 className="text-sm">GST@ 18% :</h1>
          <h5 className="bg-stone-100 text-stone-800 px-8 py-2 rounded-md text-sm text-start w-1/2">
            {typeof GST === "number" && GST !== 0 ? GST : "0,0.0"}{" "}
            <FontAwesomeIcon icon={faRupeeSign} />
          </h5>
        </div>
      )}
      <div className="flex justify-between my-2">
        <h1 className="text-stone-800 py-2 rounded-md text-sm font-semibold text-start">
          TOTAL :
        </h1>
        <h5 className="bg-[#5a51be] text-stone-100 px-8 py-2 rounded-md text-md font-semibold text-start w-1/2">
          {GrandTotal !== 0 ? GrandTotal : "0,0.0"}{" "}
          <FontAwesomeIcon icon={faRupeeSign} />
        </h5>
      </div>
    </div>
  );
};

export default Total;
