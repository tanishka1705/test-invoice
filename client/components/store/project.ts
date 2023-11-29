import {
  projectStateType,
  projectType,
  createProjectType,
} from "@/types/types";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { client } from "@/axios/instance/client";
import { getCookie } from "@/utils/cookies";

const initialState: projectStateType = {
  projects: [],
  isLoading: false,
  created: false,
  error: { status: "", message: "" },
  updated: false,
};

export const createProject = createAsyncThunk(
  "project/create",
  async (projectData: createProjectType, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/projects`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie(),
        },
        data: JSON.stringify(projectData),
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

export const fetchProjects = createAsyncThunk(
  "project/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client({
        url: `/projects`,
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

export const UpdateProject = createAsyncThunk(
  "project/update",
  async (
    {
      cid,
      _id,
      project,
    }: {
      cid: string;
      _id: string;
      project: projectType;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await client({
        url: `/projects/${cid}/${_id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie(),
        },
        data: JSON.stringify({
          description: project.description,
          projectType: project.projectType,
          conversionRate: project.conversionRate,
          rate: project.rate,
          projectAmount: project.projectAmount,
          projectCycle: project.projectCycle,
          active: project.active
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

export const DeleteProject = createAsyncThunk(
  "project/delete",
  async (
    { cid, pid }: { cid: string | undefined; pid: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await client({
        url: `/projects/${cid}/${pid}`,
        method: "DELETE",
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return pid;
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

const projectslice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCreate(state) {
      state.created = false;
    },
    setUpdate(state) {
      state.updated = false;
    },
  },
  extraReducers: (builder) => {
    // create
    builder.addCase(createProject.pending, (state) => {
      state.isLoading = true;
      state.created = false;
      state.error = { status: "", message: "" };
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.isLoading = false;

      state.created = true;
      state.projects = [...current(state.projects), action.payload.new];
      state.error = { status: "", message: "" };
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.created = false;
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // fetch
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.projects = initialState.projects;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false;

      state.projects = action.payload?.allListedProjects;
      state.error = { status: "", message: "" };
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // update project
    builder.addCase(UpdateProject.pending, (state) => {
      state.isLoading = true;
      state.updated = false;
      state.error = { status: "", message: "" };
    });
    builder.addCase(UpdateProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.updated = true;

      const filteredIndex = current(state.projects).findIndex(
        (client) => client._id === payload.updatedProject._id
      );

      state.projects[filteredIndex] = payload.updatedProject;

      state.error = { status: "", message: "" };
    });
    builder.addCase(UpdateProject.rejected, (state, action) => {
      state.isLoading = false;
      state.updated = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });

    // delete project
    builder.addCase(DeleteProject.pending, (state) => {
      state.isLoading = true;
      state.error = { status: "", message: "" };
    });
    builder.addCase(DeleteProject.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      const filteredArray = current(state.projects).filter(
        (project) => project._id !== payload
      );
      state.projects = [...filteredArray];
      state.error = { status: "", message: "" };
    });
    builder.addCase(DeleteProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as {
        status: number | string;
        message: string;
      };
    });
  },
});

export const { setCreate, setUpdate } = projectslice.actions;
export default projectslice.reducer;
