import { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/project";
import { AppDispatch, AppState } from "../store/store";
import { fetchClient } from "../store/client";
import ClientTable from "./clientTable";
import ProjectTable from "./projectTable";
import { invoiceStateType } from "@/types/types";
import { setInvoiceType, updateSpecificField, updatedChecked } from "../store/invoice";

const MainTable = () => {
  const [select, setSelect] = useState("clients");
  const [projectType, setProjectType] = useState("monthly")
  const dispatch = useDispatch<AppDispatch>();
  const invoice = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;

  const changeHandler = async (e: { target: { value: string } }) => {
    setSelect(e.target.value);
    console.log(e.target.value);

    e.target.value === "clients"
      ? await dispatch(fetchClient())
      : await dispatch(fetchProjects());
  };

  const projectViewHandler= (e: { target: { value: any } }) => {
    dispatch(setInvoiceType(e.target.value));
    invoice.detailedProject.map((project) => {
      dispatch(updatedChecked({ indx: project._id, checked: false }));
      dispatch(updateSpecificField({ indx: project._id }));
    });
  }

  return (
    <div className=" bg-white p-4 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-xl text-[#5a51be] uppercase font-bold mt-4 mb-8 p-1">{`${select === "clients" ? "All Clients" : "All Projects"
          }`}</h1>

        {select === "projects" && (
          <div className="flex items-center">
            <span className="text-sm tracking-wider text-stone-700 mr-2">Select Project Type:</span>
            <select
              id="select"
              onChange={projectViewHandler}
              className="border border-gray-300 p-1 rounded-md"
              value={projectType}
            >
              {/* <option value=''>Select</option> */}
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
              <option value="fixedbudget">Fixed Budget</option>
            </select>
          </div>
        )}

        <div className="flex">
          <form action="" className="flex flex-row items-center space-x-4">
            <label className="space-x-2 flex items-center">
              <input
                type="radio"
                value="clients"
                checked={select === "clients"}
                onChange={changeHandler}
                id="purple-radio"
                className="accent-[#5a51be] cursor-pointer"
              />
              <span className="text-sm tracking-wider text-stone-700">View Clients</span>
            </label>

            <label className="space-x-2 flex items-center">
              <input
                type="radio"
                value="projects"
                checked={select === "projects"}
                onChange={changeHandler}
                className="accent-[#5a51be] cursor-pointer"
              />
              <span className="text-sm tracking-wider text-stone-700">View Projects</span>
            </label>
          </form>
        </div>
      </div>
      {select === "clients" ? <ClientTable /> : <ProjectTable />}
    </div>
  );
};

export default MainTable;
