
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "https://medlogbook-website.onrender.com/api/logentry";

export const addLogEntry = createAsyncThunk(
  "logentry/add",
  async ({ email, categoryId, formData }, thunkAPI) => { 
    try {
      console.log("Sending API request with:", { email, categoryId, data: formData });

      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          categoryId,
          data: formData,
        }),
      });

      console.log("API Response:", response);

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add log entry");
      }

      return data.newEntry;
    } catch (error) {
      console.error("API Error:", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



  
  

const logentrySlice = createSlice({
  name: "logentry",
  initialState: {
    entries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLogEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLogEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries.push(action.payload);
      })
      .addCase(addLogEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export default logentrySlice.reducer;
