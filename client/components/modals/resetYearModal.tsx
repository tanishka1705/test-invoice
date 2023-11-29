import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState, useEffect, FormEvent } from "react";
import { setResetYear } from "../store/invoice";
import { AppDispatch, AppState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { invoiceStateType, invoiceType } from "@/types/types";
import generateArrayOfYears from "@/utils/generateYears";
import { getLocalStorage } from "@/utils/invoiceNumber";

function ResetYearModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  const { resetYear } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const dispatch = useDispatch<AppDispatch>();
  const [selectedYear, setSelectedYear] = useState<number | string>(
    getLocalStorage("year") || new Date().getFullYear()
  );

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  //const minDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  const minDate = `${currentYear}-${currentMonth.toString()}`;

  const resetYearFn = (e: FormEvent) => {
    e.preventDefault();

    localStorage.setItem("year", selectedYear.toString());
    dispatch(setResetYear(selectedYear));
    onClose(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Year</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={resetYearFn}>
            <ModalBody>
              {/* <select
                name=""
                id=""
                className="bg-transparent outline-none border-2 mt-2 px-4 py-2 w-full rounded-sm"
                value={selectedYear}
                onChange={(e: any) => setSelectedYear(e.target.value)}
              >
                {generateArrayOfYears().map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </se> */}
              <input
                type="text"
                className="bg-transparent outline-none border-2 mt-2 px-4 py-2 w-full rounded-sm"
              />
              {/* <input
                type="month"
                value={
                  selectedYear
                    ? selectedYear.toISOString().slice(0, 7)
                    : `${currentYear}-${currentMonth}`
                }
                min={minDate}
                onChange={(e: any) => {
                  const selectedDate = new Date(e.target.value);
                  if (selectedDate >= new Date(minDate)) {
                    setSelectedYear(selectedDate);
                  }
                }}
                className="border-2 mt-2 px-4 py-2 w-full rounded-sm outline-none"
              /> */}
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="purple" mr={3}>
                Reset Year
              </Button>
              <Button onClick={() => onClose(false)}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ResetYearModal;
