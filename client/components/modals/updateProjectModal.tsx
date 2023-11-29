import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import {
  clientType,
  projectStateType,
  projectType,
  rateType,
} from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import project, { UpdateProject, setUpdate } from "../store/project";
import toast from "react-hot-toast";

const UpdateProjectModal = ({
  isOpen,
  onClose,
  _id,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  _id: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, error, updated } = useSelector<AppState>(
    (state) => state.project
  ) as projectStateType;

  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<string | undefined>("");
  const [rate, setRate] = useState<rateType | any>({ currency: "", rate: 0 });
  const [conversionRate, setConversionRate] = useState<number | undefined>(0);
  const [projectAmount, setProjectAmount] = useState(0);
  const [BelongsTo, setBelongsTo] = useState<string>("");
  const [projectCycle, setProjectCycle] = useState<string | number>("");

  useEffect(() => {
    const project = projects?.filter(
      (project) => project?._id === _id
    )[0] as projectType;
    setDescription(project?.description);
    setProjectType(project?.projectType);
    setRate(project?.rate);
    setConversionRate(project?.conversionRate);
    setProjectAmount(project?.projectAmount);
    setBelongsTo(project?.projectBelongsTo?._id || project?.projectBelongsTo);
    setProjectCycle(project?.projectCycle);

    if (error.message !== "") toast.error(error.message);
    else if (updated) {
      toast.success("Project Updated!");
      dispatch(setUpdate());
    }
  }, [_id, projects, error.message, updated]);

  const calculateConvertedAmount = () => {
    if (rate.currency === "USD" || rate.currency === "POUND") {
      if (conversionRate !== undefined && projectAmount !== undefined) {

        return +(projectAmount * conversionRate).toFixed(2);
      }
    }
    return projectAmount;
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const convertedAmount = calculateConvertedAmount();

    if (projectType) {
      await dispatch(
        UpdateProject({
          cid: BelongsTo,
          _id,
          project: {
            description,
            projectType,
            rate: {
              currency: rate.currency,
              rate: projectType === "hourly" ? rate.rate : undefined,
            },
            conversionRate:
              rate.currency !== "INR" ? conversionRate : undefined,
            projectAmount: convertedAmount,
            projectCycle,
            active: true,
          },
        })
      );

      onClose(false);
    } else toast.error("Please select invoice type!");
  };

  const handleProjectTypeChange = (newProjectType : string) => {
    setProjectType(newProjectType);

    if(newProjectType === 'monthly' || newProjectType === 'hourly' || newProjectType === 'fixedbudget'){
       setRate({ currency: "INR", rate: 0 })
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)} size='2xl'>
        <ModalOverlay />
        <ModalContent className="mt-4 w-full">
          <ModalHeader>Update Project!</ModalHeader>
          <ModalCloseButton />
          <form action="" onSubmit={submitHandler}>
            <ModalBody pb={6}>
              <div className="flex flex-col my-2">
                <label
                  htmlFor="name"
                  className="font-semibold tracking-wide mb-2"
                >
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Description"
                  className="outline-none border-2 px-4 py-2 rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col my-2">
                <label
                  htmlFor="name"
                  className="font-semibold tracking-wide mb-2 xs:text-xs sm:text-sm md:text-md"
                >
                  Project Type
                </label>
                <select
                  name=""
                  id=""
                  className="bg-white outline-none border-2 px-4 py-2 rounded-md xs:text-xs sm:text-sm md:text-md"
                  value={!projectType ? "Select project type" : projectType}
                  // onChange={(e) => setProjectType(e.target.value)}
                  onChange={(e) => handleProjectTypeChange(e.target.value)}
                >
                  {/* <option value="">Select project type</option> */}
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                  <option value='fixedbudget'>Fixed Budget</option>
                </select>
              </div>
              <div className="flex flex-col my-2">
                <label
                  htmlFor="name"
                  className="font-semibold tracking-wide mb-2"
                >
                  {projectType === "monthly"
                  ? `Monthly Rate (${rate?.currency || ''})`
                  : projectType === "hourly"
                    ? `Hourly Rate (${rate?.currency || ''})`
                    : `Project Amount (${rate?.currency || ''})`
                }
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={
                    projectType === 'monthly'
                    ? `Monthly Rate (${rate?.currency || ''})`
                    : projectType === 'hourly'
                    ? `Hourly Rate (${rate?.currency || ''})`
                    : `Project Amount (${rate?.currency || ''})`
                  }
                  value={projectAmount}
                  className="outline-none border-2 px-4 py-2 rounded-md"
                  onChange={(e) => setProjectAmount(+e.target.value)}
                />
              </div>
              <div className="flex flex-col my-2">
                <label
                  htmlFor="name"
                  className="font-semibold tracking-wide mb-2"
                >
                  Project Cycle
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Project Cycle"
                  value={projectCycle}
                  className="outline-none border-2 px-4 py-2 rounded-md"
                  onChange={(e) => setProjectCycle(e.target.value)}
                />
              </div>
              <div>
                <div className="flex flex-col my-2">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    Currency
                  </label>
                  <select
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={rate?.currency}
                    onChange={(e) =>
                      setRate({ ...rate, currency: e.target.value })
                    }
                  >
                    <option value={"INR"}>INR</option>
                    <option value={"USD"}>USD</option>
                    <option value={"POUND"}>POUND</option>
                  </select>
                </div>
                {projectType === "hourly" && (
                  <div className="flex flex-col my-2">
                    <label
                      htmlFor="name"
                      className="font-semibold tracking-wide mb-2"
                    >
                      Rate
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      value={rate?.rate}
                      className="outline-none border-2 px-4 py-2 rounded-md"
                      onChange={(e) =>
                        setRate({ ...rate, rate: +e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
              {rate?.currency !== "INR" && (
                <div className="flex flex-col my-2">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    Conversion Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Conversion Rate"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(+e.target.value)}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                className="bg-[#5a51be] text-stone-100 hover:bg-[#645bc5]"
                mr={3}
                colorScheme="purple"
              >
                Save
              </Button>
              <Button onClick={() => onClose(false)}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProjectModal;
