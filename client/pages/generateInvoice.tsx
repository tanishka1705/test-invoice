import TopHeader from "@/components/generate-invoice/TopHeader";
import BottomMain from "@/components/generate-invoice/bottom/BottomMain";
import MiddleMain from "@/components/generate-invoice/middle/MiddleMain";
import Layout from "@/components/layout/Layout";
import FullPageLoader from "@/components/spinners/fullPageLoader";
import { getAllInvoice } from "@/components/store/invoiceHistory";
import { AppDispatch, AppState } from "@/components/store/store";
import { clientStateType, userStateType } from "@/types/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GenerateInvoice = () => {
  const user = useSelector<AppState>((state) => state.user) as userStateType;
  const client = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllInvoice());
  }, []);

  return (
    <Layout>
      <div className="p-4">
        {user.isLoading && client.isLoading ? (
          <FullPageLoader />
        ) : (
          <div className="bg-[#fff] py-4 px-16 xs:px-8 rounded-md">
            <TopHeader />
            <MiddleMain />
            <BottomMain />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenerateInvoice;
