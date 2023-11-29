import { addressType, clientStateType, clientType } from "@/types/types";
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
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../store/store";
import { UpdateClient, setUpdate } from "../store/client";
import toast from "react-hot-toast";
import { states } from "@/utils/states";

const UpdateClientModal = ({
  isOpen,
  _id,
  onClose,
}: {
  isOpen: boolean;
  _id: string;
  onClose: (value: boolean) => void;
}) => {
  const { clients, error, updated } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState<string>("");
  const [gstin, setgstin] = useState<string>("");
  const [address, setAddress] = useState<addressType>({
    street: "",
    city: "",
    state: states[0],
    pin: "",
    country: "",
  });

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(UpdateClient({ _id, name, gstin, address, active: true }));

    onClose(false);
  };

  useEffect(() => {
    const client = clients.filter(
      (client) => client._id === _id
    )[0] as clientType;
    setName(client?.name);
    setgstin(client?.gstin);
    setAddress(client?.address);

    if (error?.message !== "")
      toast.error(error?.message || "Something went wrong!");
    else if (updated) {
      toast.success("Client Updated!");
      dispatch(setUpdate());
    }
  }, [_id, error?.message, updated]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalOverlay />
        <ModalContent className="mt-4 w-full">
          <ModalHeader>Update Client!</ModalHeader>
          <ModalCloseButton />
          <form action="" onSubmit={submitHandler}>
            <ModalBody pb={6}>
              <div className="grid grid-cols-2 space-x-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    Client
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={name}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const pattern = /^[A-Za-z\s]*$/;
                      if (pattern.test(inputValue) || inputValue === "") {
                        setName(inputValue);
                      }
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="GSTIN"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={gstin}
                    maxLength={15}
                    onChange={(e) => {
                      const input = e.target.value;
                      const pattern = /^[A-Za-z0-9]*$/;
                      if (pattern.test(input) || input === "") {
                        setgstin(input);
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <h2 className="font-semibold my-2">Address: </h2>
              <div className="grid grid-cols-2 my-4">
                <div className="flex flex-col m-1">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    placeholder="Street"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={address?.street}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col m-1">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={address?.city}
                    required
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const pattern = /^[A-Za-z() ]*$/;
                      if (pattern.test(inputValue) || inputValue === "") {
                        setAddress({ ...address, city: inputValue });
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col m-1">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    PIN
                  </label>
                  <input
                    type="text"
                    placeholder="Pin"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    maxLength={6}
                    value={address?.pin}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const alphabeticValue = inputValue.replace(/[^0-9]/g, "");
                      setAddress({ ...address, pin: alphabeticValue });
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col m-1">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    State
                  </label>
                  <select
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={address?.state}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col m-1">
                  <label
                    htmlFor="name"
                    className="font-semibold tracking-wide mb-2"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Country"
                    className="outline-none border-2 px-4 py-2 rounded-md"
                    value={address?.country}
                    required
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const alphabeticValue = inputValue.replace(
                        /[^A-Za-z]/g,
                        ""
                      );
                      setAddress({ ...address, country: alphabeticValue });
                    }}
                  />
                </div>
              </div>
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

export default UpdateClientModal;
