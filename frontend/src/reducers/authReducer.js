import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.emailId, // Make sure the key is 'email'
        password: userData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Invalid email or password");
    }

    return data.user; // Return full user details (email, fullName, etc.)
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});


// Signup User
export const signupUser = createAsyncThunk("auth/signup", async (userData, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error || data?.message || "Something went wrong";
      throw new Error(message);
    }

    // Return the user object, ensuring it matches the structure expected in the login flow
    return data.user || data;  // support both structures
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUserLocally: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ Save user to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error || "Signup failed";
      });
  },
});

export const { logout, updateUserLocally, setUser } = authSlice.actions;
export default authSlice.reducer;
