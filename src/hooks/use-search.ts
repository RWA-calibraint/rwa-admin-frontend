import { useState } from 'react';

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState<string | undefined>('');

  return { searchValue, setSearchValue };
};
