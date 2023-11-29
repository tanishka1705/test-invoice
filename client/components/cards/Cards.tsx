import Card from "./Card";
import { AppState } from "../store/store";
import { useSelector } from "react-redux";
import {
  clientStateType,
  invoiceHistoryType,
  projectStateType,
} from "@/types/types";

const Cards = () => {
  const client = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const projects = useSelector<AppState>(
    (state) => state.project
  ) as projectStateType;
  const { invoice } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;

  return (
    <div className="flex justify-center bg-[#5a51be] h-[150px] relative mb-[5rem]">
      <div className="grid md:grid-cols-4 xs:grid-cols-1 w-full my-1a p-4 place-content-center absolute bottom-[-60px]">
        <Card
          color="bg-[#519fbe]"
          title="Total Clients"
          total={client?.clients?.length}
          isLoading={client?.isLoading}
        />
        <Card
          color="bg-[#a851be]"
          title="Total Projects"
          total={projects?.projects?.length}
          isLoading={client?.isLoading}
        />
        <Card
          color="bg-[#be9851]"
          title="Invoice Raised"
          total={
            invoice.filter(
              (invoice) =>
                invoice.status === "raised" && invoice.active === true
            ).length
          }
          isLoading={false}
        />
        <Card
          color="bg-[#be9851]"
          title="Invoice Cleared"
          total={
            invoice.filter(
              (invoice) =>
                invoice.status === "cleared" && invoice.active === true
            ).length
          }
          isLoading={false}
        />
        {/* <Card color='bg-[#be9851]' title='Invoice Cleared' total={invoice.filter(invoice => invoice.status === 'cleared' && invoice.active === true).length} isLoading={false} /> */}
      </div>
    </div>
  );
};

export default Cards;
