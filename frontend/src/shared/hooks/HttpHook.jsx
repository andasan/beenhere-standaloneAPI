import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const { errorStatusCode } = useSelector(state => state);
  const dispatch = useDispatch();

  //store data across rerender cycles
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal, //to cancel connected request
        });

        const responseData = await response.json();

        //remove active http requests when successful render
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );

        if (!response.ok) {
          // throw new Error(responseData.message);
          let err = new Error(responseData.message);
          err.status = responseData.code;
          throw err;
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        dispatch({ type: "ERR_STATUS_CODE", payload: err.status })
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {

    if(errorStatusCode === 403 || errorStatusCode === 401){
      dispatch({ type: 'LOGOUT'});
    }
    setError(null);
  };

  //cleanup function, we never continue with the request
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
