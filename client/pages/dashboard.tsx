import Layout from "@/components/layout/Layout";
import FullPageLoader from "@/components/spinners/fullPageLoader";
import { fetchClient } from "@/components/store/client";
import { AppDispatch, AppState } from "@/components/store/store";
import { clientStateType } from "@/types/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cards from "@/components/cards/Cards";
import MainTable from "@/components/tables/MainTable";
import { fetchProjects } from "@/components/store/project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSync, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getAllInvoice } from "@/components/store/invoiceHistory";
import ResetYearModal from "@/components/modals/resetYearModal";

const Dashboard = () => {
  const { isLoading, error } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const dispatch = useDispatch<AppDispatch>();

  const [isResetYearOpen, setIsResetYearOpen] = useState(false);

  useEffect(() => {
    (async function () {
      await dispatch(fetchClient());
      await dispatch(fetchProjects());
      await dispatch(getAllInvoice());
    })();
  }, []);

  if (error)
    return (
      <Layout>
        {isLoading ? (
          <FullPageLoader />
        ) : (
          <div>
            <Cards />
            <div className="p-4">
              <div className="flex justify-end space-x-2 mr-4 mb-4 px-4">
                <div className="flex justify-end space-x-2 p-4 bg-white rounded-sm">
                  <button
                    className="flex items-center space-x-2 py-2 px-3 rounded-md text-sm hover:text-[#6860c7] transition-all delay-[.1s] ease-in border-r-2"
                    onClick={() => setIsResetYearOpen(true)}
                  >
                    <FontAwesomeIcon icon={faSync} />
                    <span className="font-bold ">Reset Series</span>
                  </button>

                  <Link href="/addClient">
                    <button className="flex items-center space-x-2 py-2 px-3 rounded-md text-sm hover:text-[#6860c7] transition-all delay-[.1s] ease-in border-r-2">
                      <FontAwesomeIcon icon={faUserPlus} />
                      <span className="font-bold ">Add Client</span>
                    </button>
                  </Link>
                  <Link href="/addProject">
                    <button className="flex items-center space-x-2 py-2 px-3 rounded-md text-sm hover:text-[#6860c7] transition-all delay-[.1s] ease-in">
                      <FontAwesomeIcon icon={faPlus} />
                      <span className="font-bold">New Project</span>
                    </button>
                  </Link>
                </div>
              </div>
              <MainTable />
            </div>
          </div>
        )}
        <ResetYearModal
          isOpen={isResetYearOpen}
          onClose={() => setIsResetYearOpen(false)}
        />
      </Layout>
    );
};

export default Dashboard;
