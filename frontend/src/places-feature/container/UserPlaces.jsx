import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import {
  ModalError,
  ModalLoader,
} from "../../shared/components/Modals";

const UserPlaces = () => {
  const userId = useParams().uid;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.userWithPlaces.places);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => place._id !== deletedPlaceId);
    });
  };

  return (
    <>
      <ModalLoader isLoading={isLoading} />
      <ModalError isError={isError} errorHandler={errorHandler} error={error} />

      {!isLoading && loadedPlaces && (
        <PlaceList places={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </>
  );
};

export default UserPlaces;
