import { useState } from 'react';

export function useSearch<T extends { name: string }>(items: T[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}
