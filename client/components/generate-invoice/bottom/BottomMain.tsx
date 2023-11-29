import Table from "./Table";
import Account from "./Account";
import Total from "./Total";
import { useSelector } from "react-redux";
import { AppState } from "@/components/store/store";
import { clientStateType, invoiceStateType } from "@/types/types";
import NotFound from "@/components/alerts/notFound";
import Loader from "@/components/spinners/Loader";

const BottomMain = () => {
  const clients = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const { invoiceType } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;

  return (
    <>
      {clients.isLoading ? (
        <Loader />
      ) : (
        !clients.isHidden &&
        (clients.projects?.filter(
          (project) => project.projectType === invoiceType
        ).length !== 0 ? (
          <>
            <Table />
            <div className="flex justify-between my-[2rem] px-8">
              <Account />
              <Total />
            </div>
          </>
        ) : (
          <NotFound title="0 Project" description="Please add project first!" />
        ))
      )}
    </>
  );
};

export default BottomMain;
