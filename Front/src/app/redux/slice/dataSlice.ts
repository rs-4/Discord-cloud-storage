import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
    tokenId: string | null;
    channelId: string | null;
}

const initialState: DataState = {
    tokenId: null,
    channelId: null,
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setTokenId: (state, action: PayloadAction<string>) => {
            state.tokenId = action.payload;
        },
        setChannelId: (state, action: PayloadAction<string>) => {
            state.channelId = action.payload;
        },
    },
});

export const { setTokenId, setChannelId } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;