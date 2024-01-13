import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchValue : localStorage.getItem("searchedValue") ? JSON.parse(localStorage.getItem("searchedValue")) : null
}

const searchSlice = createSlice({
    name:"search",
    initialState,
    reducers:{
        setSearchValue(state,action){
            state.searchValue = action.payload
            localStorage.setItem("searchedValue",JSON.stringify(state.searchValue))
        }
    }
})

export const {setSearchValue} = searchSlice.actions;

export default searchSlice.reducer; 