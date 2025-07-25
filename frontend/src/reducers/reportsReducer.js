// reducers/reportsReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const API_URL = "http://localhost:5000/api/auth"; // Adjust based on your backend

// Async action to fetch user report details from DB


// Async action to fetch user report details
export const fetchUserDetails = createAsyncThunk("reports/fetchUserDetails", async (_, thunkAPI) => {
  try {
    const userEmail = thunkAPI.getState().auth.user.email; // Ensure auth state has email
    const response = await fetch(`http://localhost:5000/api/auth/userDetails/${userEmail}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user details");
    }


    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});
  

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    userDetails: {
      email: "",
      fullName: "", 
      selectedHospital: "",
      selectedSpecialty: "",
      selectedTrainingYear: "",
    },
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    reportFormat: "Summary report",
    reportFileType: "PDF (non-editable format)",

    categories: [],
    mainToggle: true,
    categoryToggles: {},
    loading: false,
    error: null,
  },
  reducers: {
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },

    setReportFormat: (state, action) => {
      state.reportFormat = action.payload;
    },
    setReportFileType: (state, action) => {
      state.reportFileType = action.payload;
    },
    toggleMain: (state) => {
      state.mainToggle = !state.mainToggle;
      Object.keys(state.categoryToggles).forEach((category) => {
        state.categoryToggles[category] = state.mainToggle;
      });
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      state.categoryToggles[category] = !state.categoryToggles[category];
    },
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    })
    .addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error || "Failed to fetch user details";
    });
},
});

export const { setFromDate, setToDate, setReportFormat, setReportFileType, toggleMain, toggleCategory } = reportsSlice.actions;
export default reportsSlice.reducer;