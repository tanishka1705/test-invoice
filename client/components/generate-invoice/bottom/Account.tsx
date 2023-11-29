import Loader from "@/components/spinners/Loader";
import { AppState } from "@/components/store/store";
import { userStateType } from "@/types/types";
import { memo } from "react";
import { useSelector } from "react-redux";

const Account = () => {
  const { user, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="uppercase font-semibold tracking-wide">{user?.name}</h1>
          <h5 className=" tracking-wider text-sm t">A/C No: {user?.account.acc_no}</h5>
          <h5 className=" tracking-wider text-sm t">BANK: {user?.account.bank}</h5>
          <h5 className=" tracking-wider text-sm t">IFSC: {user?.account.ifsc}</h5>
        </div>
      )}
    </>
  );
};

export default memo(Account);
