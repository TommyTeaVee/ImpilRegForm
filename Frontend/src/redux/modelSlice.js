import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerModel, getRegistrations, updateRegistrationStatus, deleteRegistration, getRegistrationById } from "../api";

// Thunk: submit a new model registration
export const submitModel = createAsyncThunk(
  "model/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await registerModel(formData);
      return res.data; // API returns { message, registration }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.response?.data?.message || "Submission failed"
      );
    }
  }
);

// Thunk: fetch all registrations
export const fetchRegistrations = createAsyncThunk(
  "model/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRegistrations();
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch registrations");
    }
  }
);

// Thunk: fetch single registration
export const fetchRegistrationById = createAsyncThunk(
  "model/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRegistrationById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch registration");
    }
  }
);

// Thunk: update status
export const changeRegistrationStatus = createAsyncThunk(
  "model/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await updateRegistrationStatus(id, status);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to update status");
    }
  }
);

// Thunk: delete registration
export const removeRegistration = createAsyncThunk(
  "model/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRegistration(id);
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete registration");
    }
  }
);

const modelSlice = createSlice({
  name: "model",
  initialState: {
    loading: false,
    error: null,
    success: false,
    registrations: [],
    selectedRegistration: null,
  },
  reducers: {
    resetModelState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // submitModel
      .addCase(submitModel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitModel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.registrations.unshift(action.payload.registration); // add new one
      })
      .addCase(submitModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Submission failed";
      })

      // fetchRegistrations
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.registrations = action.payload;
      })

      // fetch one
      .addCase(fetchRegistrationById.fulfilled, (state, action) => {
        state.selectedRegistration = action.payload;
      })

      // update status
      .addCase(changeRegistrationStatus.fulfilled, (state, action) => {
        const index = state.registrations.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.registrations[index] = action.payload;
        }
      })

      // delete
      .addCase(removeRegistration.fulfilled, (state, action) => {
        state.registrations = state.registrations.filter((r) => r.id !== action.payload);
      });
  },
});

export const { resetModelState } = modelSlice.actions;
export default modelSlice.reducer;
