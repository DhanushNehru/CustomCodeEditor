import { useEffect, useState } from "react";

const initialFetchState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const useGetStars = () => {
  const [fetchState, setFetchState] = useState(initialFetchState);
  const [repositoryStarts, setRepositoryStars] = useState(0);

  const getStars = async () => {
    try {
      setFetchState({ ...initialFetchState, isLoading: true });
      const res = await fetch(
        "https://api.github.com/repos/DhanushNehru/CustomCodeEditor"
      );
      if (res.status === 200) {
        const result = await res.json();
        setRepositoryStars(result.stargazers_count);
        setFetchState(initialFetchState);
      } else
        throw Error("Error happend in getting repository stars, retry again!.");
    } catch (error) {
      setFetchState({
        ...initialFetchState,
        isError: true,
        errorMessage: error.message,
      });
    }
  };

  useEffect(() => {
    getStars();
  }, []);

  return { fetchState, repositoryStarts, getStars };
};
