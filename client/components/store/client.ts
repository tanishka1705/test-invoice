import { client } from "@/axios/instance/client";
import { clientStateType, clientType } from "@/types/types";
import { getCookie } from "@/utils/cookies";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const initialState: clientStateType = {
  clients: [],
  created: false,
  updated: false,
  clientById: {
    _id: "",
    name: "",
    gstin: "",
    tds: 0,
    address: {
      street: "",
      city: "",
      pin: "",
      state: "",
      country: "",
    },
    active: true,
  },
  clientState: "",
  projects: [],
  isLoading: false,
  isHidden: true,
  error: { status: "", message: "" },
};

export const createClient = createAsyncThunk(
  "client/create",
  async (clientData: clientType, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/companies`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie(),
        },
        data: JSON.stringify(clientData),
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

export const fetchClient = createAsyncThunk(
  "client/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/companies`,
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

export const fetchClientProjects = createAsyncThunk(
  "client/fetch/project",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/companies/project/${id}`,
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

export const UpdateClient = createAsyncThunk(
  "client/update",
  async (user: clientType, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/companies/${user._id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie(),
        },
        data: JSON.stringify({
          name: user.name,
          gstin: user.gstin,
          address: user.address,
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

export const DeleteClient = createAsyncThunk(
  "client/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/companies/${_id}`,
        method: "DELETE",
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return _id;
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

const clientslice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setHidden(state, action) {
      state.isHidden = action.payload;
    },
    setCreate(state) {
      state.created = false;
    },
    setUpdate(state) {
      state.updated = false;
    },
    getClientState(state, { payload }) {  
      state.clientState = current(state.clients).filter(
        (client) => client._id === payload
      )[0].address.state;
    },
    getClientById(state, { payload }) {
      state.clientById = current(state.clients).filter(
        (client) => client._id === payload
      )[0];
    },
  },
  extraReducers: (builder) => {
    // create
    builder.addCase(createClient.pending, (state) => {
      state.isLoading = true;
      state.created = false;
      state.error = { status: "", message: "" };
    });
    builder.addCase(createClient.fulfilled, (state, action) => {
      state.isLoading = false;

      state.created = true;
      state.clients = [...current(state.clients), action.payload.new];
      state.error = { status: "", message: "" };
    });
    builder.addCase(createClient.rejected, (state, action) => {
      state.created = false;
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // fetch
    builder.addCase(fetchClient.pending, (state) => {
      state.isLoading = true;
      state.clients = initialState.clients;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchClient.fulfilled, (state, action) => {
      state.isLoading = false;

      state.clients = action.payload.allListedCompanies;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchClient.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // fetch client project
    builder.addCase(fetchClientProjects.pending, (state) => {
      state.isLoading = true;
      state.projects = initialState.projects;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchClientProjects.fulfilled, (state, action) => {
      state.isLoading = false;

      state.projects = action.payload.allListedProjects[0].projects;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchClientProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // update client
    builder.addCase(UpdateClient.pending, (state) => {
      state.isLoading = true;
      state.error = { status: "", message: "" };
    });
    builder.addCase(UpdateClient.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      const filteredIndex = current(state.clients).findIndex(
        (client) => client._id === payload.updatedCompany._id
      );

      state.clients[filteredIndex] = payload.updatedCompany;
      state.error = { status: "", message: "" };
    });
    builder.addCase(UpdateClient.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // delete client
    builder.addCase(DeleteClient.pending, (state) => {
      state.isLoading = true;
      state.error = { status: "", message: "" };
    });
    builder.addCase(DeleteClient.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      const filteredArray = current(state.clients).filter(
        (client) => client._id !== payload
      );
      state.clients = [...filteredArray];
      state.error = { status: "", message: "" };
    });
    builder.addCase(DeleteClient.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });
  },
});

export const {
  setHidden,
  getClientState,
  getClientById,
  setCreate,
  setUpdate,
} = clientslice.actions;
export default clientslice.reducer;
