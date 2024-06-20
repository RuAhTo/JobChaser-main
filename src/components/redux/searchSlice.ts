// redux/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Job } from '../../jobService';

export const getUniqueTags = (jobs: Job[]): string[] => {
  const tagsSet = new Set<string>();

  jobs.forEach(job => {
    job.languages.forEach(language => tagsSet.add(language));
    job.tools.forEach(tool => tagsSet.add(tool));
  });

  return Array.from(tagsSet);
};

interface SearchState {
  query: string;
  tags: string[];
}

const initialState: SearchState = {
  query: '',
  tags: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    addTag(state, action: PayloadAction<string>) {
      state.tags.push(action.payload);
    },
    removeTag(state, action: PayloadAction<string>) {
      state.tags = state.tags.filter(tag => tag !== action.payload);
    },
  },
});

export const { setSearchQuery, addTag, removeTag } = searchSlice.actions;
export default searchSlice.reducer;
