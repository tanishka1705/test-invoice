import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import { AppDispatch, AppState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clientStateType,
  clientType,
  dataProps,
  invoiceStateType,
  rateType,
  userStateType,
} from "@/types/types";
import {
  calculateGST,
  calculateSubtotal,
  setisChecked,
  updateDetailedProjectOnChecked,
  updatedChecked,
} from "../store/invoice";

const CheckedModal = ({ uniqueKey }: { uniqueKey: string }) => {
  const { invoiceType, isChecked, detailedProject } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { user, isLoading } = useSelector<AppState>(
    (state) => state.user
  ) as userStateType;
  const client = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const { projects } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const dispatch = useDispatch<AppDispatch>();

  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("");
  const [workingDays, setworkingDays] = useState("");
  const [totalWorkingDays, settotalworkingDays] = useState("");
  const [rate, setRate] = useState<rateType | any>({
    currency: "INR",
    rate: 0,
  });
  const [hours, sethours] = useState<number>(0.0);
  const [conversionRate, setConversionRate] = useState<number>();
  const [indx, setIndx] = useState<number>();
  const [projectAmount, setProjectAmount] = useState<number>(0.0);

  useEffect(() => {
    const project = detailedProject.filter(
      (project) => project._id === uniqueKey
    )[0] as dataProps;

    setIndx(detailedProject.findIndex((project) => project._id === uniqueKey));
    setPeriod(project?.period || "");
    setDescription(project?.description || "");
    setworkingDays(project?.workingDays || "");
    settotalworkingDays(project?.totalWorkingDays || "");
    setRate(project?.rate);
    sethours(project?.hours || 0.0);
    setConversionRate(project?.conversionRate);
    setProjectAmount(project?.projectAmount || 0.0);
  }, [detailedProject, uniqueKey]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const project = detailedProject.filter(
      (project) => project._id === uniqueKey
    )[0] as dataProps;

    if (workingDays && totalWorkingDays) {
      if (
        +workingDays > 0 &&
        +totalWorkingDays > 0 &&
        invoiceType === "monthly"
      ) {
        if (+workingDays <= +totalWorkingDays) {
          dispatch(
            updateDetailedProjectOnChecked({
              ...project,
              indx: projects.findIndex((project) => project._id === uniqueKey),
              description,
              period,
              workingDays,
              totalWorkingDays,
              amount: "0,0.0",
              rate: project.rate,
              conversionRate,
              projectBelongsTo: project.projectBelongsTo,
            })
          );
          dispatch(
            calculateSubtotal({
              flag: undefined,
              tds: client.clients.filter(
                (client) => client._id === project?.projectBelongsTo
              )[0].tds,
            })
          );

          const clientState = client.clients.filter(
            (client) => client._id === project?.projectBelongsTo
          )[0] as clientType;

          !isLoading &&
            dispatch(
              calculateGST({
                userState: user.address.state,
                clientState: clientState?.address?.state,
              })
            );
        } else
          return toast.error(
            `working days can'nt be greater than totalworking days`
          );
      } else if (
        +workingDays < 0 ||
        +totalWorkingDays < 0 ||
        (hours && hours < 0)
      )
        return toast.error("values can't be less than to 0");
      else if (invoiceType === "hourly" && hours && hours > 0) {
        dispatch(
          updateDetailedProjectOnChecked({
            ...project,
            indx: projects.findIndex((project) => project._id === uniqueKey),
            description,
            hours: hours.toString(),
            rate: rate,
            conversionRate,
          })
        );
        dispatch(
          calculateSubtotal({
            flag: undefined,
            tds: client.clients.filter(
              (client) => client._id === project?.projectBelongsTo
            )[0].tds,
          })
        );

        const clientState = client.clients.filter(
          (client) => client._id === project?.projectBelongsTo
        )[0] as clientType;

        !isLoading &&
          dispatch(
            calculateGST({
              userState: user.address.state,
              clientState: clientState?.address?.state,
            })
          );
      } else if (invoiceType === "fixedbudget") {
        dispatch(
          updateDetailedProjectOnChecked({
            ...project,
            indx: projects.findIndex((project) => project._id === uniqueKey),
            description,
            projectAmount,
          })
        );
        dispatch(
          calculateSubtotal({
            flag: undefined,
            tds: client.clients.filter(
              (client) => client._id === project?.projectBelongsTo
            )[0].tds,
          })
        );

        const clientState = client.clients.filter(
          (client) => client._id === project?.projectBelongsTo
        )[0] as clientType;

        !isLoading &&
          dispatch(
            calculateGST({
              userState: user.address.state,
              clientState: clientState?.address?.state,
            })
          );
      } else return toast.error("all fields are required!");
      dispatch(setisChecked(false));
    }
  };

  return (
    <>
      <Modal isOpen={isChecked} onClose={() => dispatch(setisChecked(false))}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[#5a51be] text-start uppercase font-bold">
            Update Project
          </ModalHeader>
          <ModalBody pb={6}>
            <form action="" className="p-4" onSubmit={submitHandler}>
              {invoiceType === "monthly" && (
                <>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      autoFocus
                      placeholder="Some Message!"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>

                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Period <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      required
                      autoFocus
                      placeholder="Some Message!"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Working Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={workingDays !== "0" ? workingDays : ""}
                      onChange={(e) => setworkingDays(e.target.value)}
                      required
                      placeholder="0"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Total Working Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={totalWorkingDays !== "0" ? totalWorkingDays : ""}
                      onChange={(e) => settotalworkingDays(e.target.value)}
                      required
                      step="0.01"
                      placeholder="0"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                </>
              )}
              {invoiceType === "hourly" && (
                <>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={description}
                      autoFocus
                      onChange={(e: any) => setDescription(e.target.value)}
                      required
                      placeholder=""
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Rate{" "}
                      {rate?.currency === "USD"
                        ? "$"
                        : rate?.currency === "POUND"
                        ? "£"
                        : "INR"}{" "}
                      / Hour <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rate?.rate}
                      autoFocus
                      onChange={(e: any) =>
                        setRate({ ...rate, rate: +e.target.value })
                      }
                      required
                      placeholder=""
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Hours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={hours !== 0.0 ? hours : ""}
                      autoFocus
                      onChange={(e: any) => sethours(e.target.value)}
                      required
                      placeholder="0.0"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Conversion Rate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={conversionRate}
                      autoFocus
                      onChange={(e: any) => setConversionRate(e.target.value)}
                      required
                      disabled={rate?.currency !== "INR" ? false : true}
                      placeholder="0.0"
                      className={`border-2 mt-2 px-4 py-2 rounded-sm outline-none ${
                        rate?.currency !== "INR"
                          ? "cursor-text"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>
                </>
              )}
              {invoiceType === "fixedbudget" && (
                <>
                  {/* Fixed Budget fields */}
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      autoFocus
                      placeholder=""
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold text-lg">
                      Project Amount (INR){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={projectAmount !== 0.0 ? projectAmount : ""}
                      // value={projectAmount}
                      onChange={(e) => setProjectAmount(+e.target.value)}
                      required
                      placeholder="0.0"
                      className="border-2 mt-2 px-4 py-2 rounded-sm outline-none"
                    />
                  </div>
                </>
              )}
              <ModalFooter>
                <Button
                  type="submit"
                  mr={3}
                  colorScheme="purple"
                  className="bg-[#5a51be] text-stone-100 hover:bg-[#5a51be]"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setisChecked(false));
                    dispatch(
                      updatedChecked({ indx: uniqueKey, checked: false })
                    );
                  }}
                  className="bg-slate-100"
                >
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckedModal;
