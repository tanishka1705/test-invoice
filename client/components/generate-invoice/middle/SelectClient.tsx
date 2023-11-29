import {
  fetchClient,
  fetchClientProjects,
  getClientById,
  setHidden,
} from "@/components/store/client";
import {
  calculateGST,
  setInvoiceType,
  setTotalToZero,
  updateSpecificField,
  updatedChecked,
} from "@/components/store/invoice";
import { AppDispatch, AppState } from "@/components/store/store";
import {
  clientStateType,
  clientType,
  invoiceStateType,
  userStateType,
} from "@/types/types";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SelectClient = () => {
  const { user, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;
  const { clients } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const invoice = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;

  const dispatch = useDispatch<AppDispatch>();
  const [clientId, setClientId] = useState<string | undefined>(undefined);

  async function onLoadClient() {
    await dispatch(fetchClient());
  }

  function changeHandler(e: ChangeEvent<HTMLSelectElement>) {
    setClientId(e.target.value);

    const clientState = clients.filter(
      (client) => client._id === e.target.value
    )[0] as clientType;
    !isLoading &&
      dispatch(
        calculateGST({
          userState: user.address.state,
          clientState: clientState?.address?.state,
        })
      );
    !isLoading && dispatch(getClientById(clientState._id));
  }

  function changeInvoiceTypeHandler(e: { target: { value: any } }) {
    dispatch(setInvoiceType(e.target.value));
    invoice.detailedProject.map((project) => {
      dispatch(updatedChecked({ indx: project._id, checked: false }));
      dispatch(updateSpecificField({ indx: project._id }));
    });
    dispatch(setTotalToZero());
  }

  useEffect(() => {
    onLoadClient();
  }, []);

  useEffect(() => {
    if (
      clientId === "undefined" ||
      clientId === undefined ||
      invoice.invoiceType === ""
    )
      dispatch(setHidden(true));
    else {
      dispatch(setHidden(false));
      dispatch(fetchClientProjects(clientId));
    }
  }, [clientId, invoice.invoiceType]);

  return (
    <div className="flex justify-around">
      <div className="mx-1">
        <form action="" className="flex flex-col">
          <label
            htmlFor="select"
            className="font-semibold xs:text-xs sm:text-md md:text-sm tracking-wider"
          >
            Bill To:
          </label>
          <select
            id="select"
            className="outline-none bg-transparent border-2 px-4 py-2 rounded-sm my-2 xs:text-xs sm:text-sm md:text-[10pt]"
            value={clientId}
            onChange={changeHandler}
          >
            {clients?.length !== 0 ? (
              <>
                <option value={"undefined"}>Select Client</option>
                {clients?.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name.toUpperCase()}
                  </option>
                ))}
              </>
            ) : (
              <option value="">There are no clients</option>
            )}
          </select>
        </form>
      </div>
      <div className="mx-1">
        <form action="" className="flex flex-col">
          <label
            htmlFor="select"
            className="font-semibold text-sm tracking-wider"
          >
            Project Type:
          </label>
          <select
            id="select"
            onChange={changeInvoiceTypeHandler}
            className="outline-none bg-transparent border-2 px-4 py-2 rounded-sm my-2 xs:text-xs sm:text-sm md:text-[10pt] tracking-wider"
          >
            <option value="">Select project type</option>
            <option value="monthly">Monthly</option>
            <option value="hourly">Hourly</option>
            <option value="fixedbudget">Fixed Budget</option>
          </select>
        </form>
      </div>
    </div>
  );
};

export default memo(SelectClient);
