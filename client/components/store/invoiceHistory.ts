import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current,
} from "@reduxjs/toolkit";
import { getCookie } from "@/utils/cookies";
import { client } from "@/axios/instance/client";
import { invoiceHistoryType, invoiceType } from "@/types/types";

const initialState: invoiceHistoryType = {
  invoice: [
    {
      _id: "",
      createdFor: "",
      invoiceNumber: "",
      createdOn: "",
      dueDate: "",
      projects: [],
      subtotal: 0.0,
      GST: 0,
      GrandTotal: 0.0,
      receivedStatus: [],
      invoiceStatus: "",
      status: "",
      invoiceType: "",
      active: true,
    },
  ],
  invoiceById: {
    _id: "",
    createdFor: "",
    invoiceNumber: "",
    createdOn: "",
    dueDate: "",
    projects: [],
    subtotal: 0.0,
    GST: 0,
    GrandTotal: 0.0,
    receivedStatus: [],
    invoiceStatus: "",
    status: "",
    invoiceType: "",
    active: true,
  },
  isLoading: false,
  created: false,
  updated: false,
  error: { status: "", message: "" },
};

export const postInvoiceHistory = createAsyncThunk(
  "invoice/history/create",
  async (invoice: invoiceType, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/invoice`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie(),
        },
        data: JSON.stringify(invoice),
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        message:
          error.response.data.message ||
          error.message ||
          "An unknown error has been occured, Please try again later!",
      });
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  "invoice/history/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/invoice/${id}`,
        method: "GET",
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        message:
          error.response.data.message ||
          error.message ||
          "An unknown error has been occured, Please try again later!",
      });
    }
  }
);
export const getAllInvoice = createAsyncThunk(
  "invoice/history/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/invoice`,
        method: "GET",
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        message:
          error.response.data.message ||
          error.message ||
          "An unknown error has been occured, Please try again later!",
      });
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/history/update",
  async (
    {
      id,
      dataToUpdate,
    }: {
      id: string;
      dataToUpdate: { amountReceived: number | undefined; amountDate: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await client({
        url: `/invoice/${id}`,
        method: "PATCH",
        headers: {
          Authorization: getCookie(),
        },
        data: JSON.stringify({
          amountReceived: dataToUpdate.amountReceived,
          receivedOn: dataToUpdate.amountDate,
        }),
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        message:
          error.response.data.message ||
          error.message ||
          "An unknown error has been occured, Please try again later!",
      });
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/history/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/invoice/${id}`,
        method: "DELETE",
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return id;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        message:
          error.response.data.message ||
          error.message ||
          "An unknown error has been occured, Please try again later!",
      });
    }
  }
);

const historyslice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoiceStatus(state, { payload }) {
      // console.log(payload);
      
      const invoice = current(state.invoice).filter(
        (invoice) => invoice._id === payload._id
      )[0];

      const indx = current(state.invoice).findIndex(
        (invoice) => invoice._id === payload._id
      );
      // console.log(invoice, indx);
      

      state.invoice[indx] = { ...invoice, invoiceStatus: payload.status };
      // console.log(current(state.invoiceById));
      
      state.invoiceById = {...invoice, invoiceStatus: payload.status}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postInvoiceHistory.pending, (state) => {
      state.isLoading = true;
      state.error = initialState.error;
    });
    builder.addCase(postInvoiceHistory.fulfilled, (state, { payload }) => {
      state.invoice.push({ ...payload.newInvoice });
      state.isLoading = initialState.isLoading;
      state.error = initialState.error;
    });
    builder.addCase(postInvoiceHistory.rejected, (state, { payload }) => {
      state.invoice = initialState.invoice;
      state.isLoading = initialState.isLoading;
      state.error = payload;
    });
    // get all
    builder.addCase(getAllInvoice.pending, (state) => {
      state.isLoading = true;
      state.error = initialState.error;
    });
    builder.addCase(getAllInvoice.fulfilled, (state, { payload }) => {
      state.invoice = payload.allInvoices;
      state.isLoading = initialState.isLoading;
      state.error = initialState.error;
    });
    builder.addCase(getAllInvoice.rejected, (state, { payload }) => {
      state.invoice = initialState.invoice;
      state.isLoading = initialState.isLoading;
      state.error = payload;
    });
    // get by id
    builder.addCase(getInvoiceById.pending, (state) => {
      state.isLoading = true;
      state.error = initialState.error;
    });
    builder.addCase(getInvoiceById.fulfilled, (state, { payload }) => {
      state.invoiceById = {...payload.invoice};
      state.isLoading = initialState.isLoading;
      state.error = initialState.error;
    });
    builder.addCase(getInvoiceById.rejected, (state, { payload }) => {
      state.invoiceById = initialState.invoiceById;
      state.isLoading = initialState.isLoading;
      state.error = payload;
    });
    // update project
    builder.addCase(updateInvoice.pending, (state) => {
      state.isLoading = true;
      state.updated = false;
      state.error = { status: "", message: "" };
    });
    builder.addCase(updateInvoice.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.updated = true;

      const filteredIndex = current(state.invoice).findIndex(
        (invoice) => invoice._id === payload.updatedInvoice._id
      );

      state.invoice[filteredIndex] = payload.updatedInvoice;
      state.error = { status: "", message: "" };
    });
    builder.addCase(updateInvoice.rejected, (state, action) => {
      state.isLoading = false;
      state.updated = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });
    // delete
    builder.addCase(deleteInvoice.pending, (state) => {
      state.isLoading = true;
      state.error = { status: "", message: "" };
    });
    builder.addCase(deleteInvoice.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      const filteredArray = current(state.invoice).filter(
        (invoice) => invoice._id !== payload
      );
      state.invoice = [...filteredArray];
      state.error = { status: "", message: "" };
    });
    builder.addCase(deleteInvoice.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });
  },
});

export const { setInvoiceStatus } = historyslice.actions;
export default historyslice.reducer;
