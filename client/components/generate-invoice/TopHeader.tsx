import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import { userStateType } from "@/types/types";
import ButtonLoading from "../spinners/buttonLoading";
import { memo } from "react";
import GeneratePDF from "./bottom/GeneratePDF";
import InvoiceNumber from "./middle/InvoiceNumber";

const TopHeader = () => {
  const { user, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;

  return (
    <>
      <div className="flex justify-between border-b-2 border-stone-100 py-4 sticky z-10 top-0 bg-white px-4">
        <div className="w-full flex items-center">
          {user?.name?.toLowerCase().startsWith("gammaedge") ? (
            <img src="/images/logo.png" alt="" className="w-[30%]" />
          ) : (
            <img src="/images/cubexoLogo.png" alt="" className="w-[20%]" />
          )}
        </div>
        <GeneratePDF />
      </div>
      <div className="sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 my-4 px-8">
        <InvoiceNumber />
        {isLoading ? (
          <ButtonLoading />
        ) : (
          <div className="md:px-[4rem] xs:pl-0 xs:pr-0 xs:text-xs md:text-base">
            <h1 className="uppercase font-semibold tracking-wide">
              {user?.name}
            </h1>
            <h5 className="text-sm tracking-wider">
              GSTIN: <span className="uppercase">{user?.gstin}</span>
            </h5>
            <h5 className="text-sm tracking-wider">
              PAN: <span>{user?.pan}</span>
            </h5>
            <p className="text-sm tracking-wider">{`${user?.address.street}, ${user?.address.city} ${user?.address.pin}, ${user?.address.state}, ${user?.address.country}`}</p>
            <p className="text-sm tracking-wider">
              <span className="underline text-blue-500">{user?.email}</span>
              <span> | </span>
              <span>+91-{user?.contact}</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(TopHeader);
