// Search.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { setSearchQuery, addTag, removeTag, getUniqueTags } from './redux/searchSlice';
import { Job } from '../jobService';
import '../index.css';

interface SearchProps {
  jobs: Job[];
  onSearch: (filteredJobs: Job[]) => void;
}

const Search: React.FC<SearchProps> = ({ jobs, onSearch }) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const tags = useSelector((state: RootState) => state.search.tags);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);

  useEffect(() => {
    const tags = getUniqueTags(jobs);
    setUniqueTags(tags);
  }, [jobs]);

  const handleSearch = (query: string, tags: string[]) => {
    const fullQuery = `${query} ${tags.join(' ')}`.toLowerCase();
    const filtered = filterJobs(jobs, fullQuery);
    onSearch(filtered);
  };

  const filterJobs = (jobs: Job[], query: string): Job[] => {
    return jobs.filter((job) => {
      const { company, position, location, languages, tools } = job;
      const jobData = [company, position, location, ...languages, ...tools].join(' ').toLowerCase();
      return jobData.includes(query);
    });
  };

  const handleTagClick = (tag: string) => {
    if (tags.includes(tag)) {
      dispatch(removeTag(tag));
      handleSearch(searchQuery, tags.filter(t => t !== tag));
    } else {
      dispatch(addTag(tag));
      handleSearch(searchQuery, [...tags, tag]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    handleSearch(e.target.value, tags);
  };

  return (
    <div>
      <form className='w-102 h-14 p-1 m-2 flex justify-center items-center border-primary border-2 rounded-full' onSubmit={(e) => e.preventDefault()}>
        <input
          className='border-primary w-full m-2 p-1 rounded-full'
          value={searchQuery}
          onChange={handleInputChange}
          type="text"
          id="search-input"
        />
        <button className='p-1 bg-secondary rounded-full flex justify-center items-center' type="submit">
          <img className='w-5 m-2' src="./assets/magnifying-glass.png" alt="magnifying glass" />
        </button>
      </form>
      <div className='flex flex-wrap mt-2'>
        {uniqueTags.map(tag => (
          <button
            key={tag}
            className={`m-2 p-2 border rounded-full ${tags.includes(tag) ? 'bg-primary' : 'bg-secondary'}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Search;
