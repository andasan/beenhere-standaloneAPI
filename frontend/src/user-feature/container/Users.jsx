import React, { useState, useEffect } from "react";

import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { ModalError, ModalLoader } from "../../shared/components/Modals";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/users/`);
        setLoadedUsers(responseData.users);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  return (
    <>
      <ModalLoader isLoading={isLoading} />
      <ModalError isError={isError} errorHandler={errorHandler} error={error} />
      <div className="container">
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </div>
    </>
  );
};

export default Users;
