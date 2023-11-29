import { dataProps, invoiceStateType } from "@/types/types";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState: invoiceStateType = {
  invoiceType: "",
  invoiceNumber: "",
  Date: new Date(),
  DueDate: new Date(),
  isChecked: false,
  detailedProject: [],
  subtotal: 0.0,
  discount: 0,
  tds: 0,
  GST: 0,
  GrandTotal: 0.0,
  resetYear: new Date().getFullYear(),
  active: true,
};

const invoiceslice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoiceType(state, action) {
      state.invoiceType = action.payload;
    },
    setisChecked(state, action) {
      state.isChecked = action.payload;
    },
    setInvoiceNumber(state, { payload }) {
      state.invoiceNumber = payload;
    },
    setDate(state, { payload }) {
      state.Date = payload;
    },
    setDueDate(state, { payload }) {
      state.DueDate = payload;
    },
    setResetYear(state, { payload }) {
      state.resetYear = payload;
    },
    setDiscount(state, { payload }) {
      state.discount = payload;
    },
    updatedChecked(
      state,
      { payload }: { payload: { indx: string; checked: boolean } }
    ) {
      const projectIndx = current(state.detailedProject).findIndex(
        (project) => project._id === payload.indx
      );

      state.detailedProject[projectIndx].checked = payload.checked;
    },
    setDetailedProject(state, action) {
      state.detailedProject = action.payload;
    },
    updateDetailedProjectOnChecked(state, { payload }: { payload: dataProps }) {
      const project = current(state.detailedProject).filter(
        (project) => project._id === payload._id
      )[0];
      const projectIndx = current(state.detailedProject).findIndex(
        (project) => project._id === payload._id
      );

      if (
        state.invoiceType === "monthly" &&
        payload.period &&
        payload.workingDays &&
        payload.totalWorkingDays
      ) {
        const projectAmount = Number(project?.projectAmount);
        const workingDays = Number(payload?.workingDays);
        const totalWorkingDays = Number(payload?.totalWorkingDays);

        // formula
        const amount = (
          (projectAmount / totalWorkingDays) *
          workingDays
        ).toFixed(3);

        state.detailedProject[projectIndx] = {
          ...payload,
          amount: Number(amount).toFixed(2),
        };
      } else if (state.invoiceType === "hourly" && payload.hours) {
        const rate = Number(project?.rate?.rate);
        const currency = project?.rate?.currency;
        const hours = Number(payload?.hours);
        const conversionRate = Number(project?.conversionRate);

        // formula
        const amount =
          currency === "INR" ? rate * hours : rate * conversionRate * hours;

        state.detailedProject[projectIndx] = {
          ...payload,
          amount: amount?.toFixed(2),
        };
      } else {
        state.detailedProject[projectIndx] = {
          ...payload,
          amount: Number(payload?.projectAmount)?.toFixed(2),
        };
      }
    },
    calculateSubtotal(
      state,
      { payload }: { payload: { flag?: boolean; discount?: any; tds: number } }
    ) {
      if (payload?.flag) {
        state.subtotal = +payload.discount.toFixed(2);
      } else {
        const istrue = current(state.detailedProject).filter(
          (project) => project.checked === true
        );
        const total = istrue.reduce(
          (value, project) => (value += Number(project.amount)),
          0
        );
        state.subtotal = +total.toFixed(2);
      }
      state.tds = +((+state.subtotal * +payload?.tds) / 100).toFixed(2);
    },
    calculateGST(
      state,
      { payload }: { payload: { userState: string; clientState: string } }
    ) {
      console.log(state.tds);
      if (payload.userState && payload.clientState) {
        if (
          payload?.userState?.toLowerCase() ===
          payload?.clientState?.toLowerCase()
        ) {
          const CGST = +((state.subtotal * 9) / 100).toFixed(2);
          const SGST = +((state.subtotal * 9) / 100).toFixed(2);

          state.GST = { CGST, SGST };
          state.GrandTotal = +(
            state.subtotal +
            state.GST.CGST +
            state.GST.SGST
          ).toFixed(3);
        } else {
          state.GST = +((state.subtotal * 18) / 100).toFixed(2);
          state.GrandTotal = +(state.subtotal + state.GST).toFixed(2);
        }
      } else {
        if (typeof state.GST === "object") {
          const CGST = +((state.subtotal * 9) / 100).toFixed(2);
          const SGST = +((state.subtotal * 9) / 100).toFixed(2);

          state.GST = { CGST, SGST };
          state.GrandTotal = +(
            state.subtotal +
            state.GST.CGST +
            state.GST.SGST
          ).toFixed(3);
        } else {
          state.GST = +((state.subtotal * 18) / 100).toFixed(2);
          state.GrandTotal = +(state.subtotal + state.GST).toFixed(2);
        }
      }
      if (state.tds)
        state.GrandTotal = +(state.GrandTotal - state.tds).toFixed(2);
    },
    setTotalToZero(state) {
      (state.subtotal = 0), (state.GrandTotal = 0);

      if (typeof state.GST !== "number") {
        state.GST.CGST = 0;
        state.GST.SGST = 0;
      } else {
        state.GST = 0;
      }
    },
    updateSpecificField(state, { payload }: { payload: { indx: string } }) {
      const { indx } = payload;
      const pindex = state.detailedProject.findIndex(
        (project) => project._id === indx
      );
      if (state.invoiceType === "monthly") {
        state.detailedProject[pindex].period = "";
        state.detailedProject[pindex].totalWorkingDays = "0";
        state.detailedProject[pindex].workingDays = "0";
      } else state.detailedProject[pindex].hours = "0.0";
      state.detailedProject[pindex].amount = 0.0;
    },
  },
});

export const {
  setInvoiceType,
  setisChecked,
  setDetailedProject,
  updateDetailedProjectOnChecked,
  calculateSubtotal,
  updatedChecked,
  calculateGST,
  setInvoiceNumber,
  setDate,
  setDueDate,
  setTotalToZero,
  setResetYear,
  updateSpecificField,
  setDiscount,
} = invoiceslice.actions;
export default invoiceslice.reducer;
