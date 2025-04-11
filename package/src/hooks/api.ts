"use client";

import { useEffect, useState } from 'react';

// Custom hook for API data fetching
export function useApiData(endpoint, defaultValue = []) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(`Error fetching data from ${endpoint}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// Custom hook for form submission
export function useFormSubmit(endpoint, method = 'POST') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      const result = await response.json();
      setSuccess(true);
      return result;
    } catch (err) {
      console.error(`Error submitting to ${endpoint}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
}

// Custom hook for search functionality
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`Search error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data.results);
      return data.results;
    } catch (err) {
      console.error('Error performing search:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, results, loading, error, performSearch };
}
