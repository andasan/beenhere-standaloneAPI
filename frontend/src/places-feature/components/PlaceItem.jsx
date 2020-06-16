import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useHttpClient } from "../../shared/hooks/HttpHook";
import {
  ModalError,
  ModalConfirm,
  ModalMap,
  ModalLoader,
} from "../../shared/components/Modals";

const PlaceItem = (props) => {
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [showMap, setShowMap] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { userId, token } = useSelector((state) => state);
  const dispatch = useDispatch();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openDeleteHandler = () => setShowConfirm(true);
  const closeDeleteHandler = () => setShowConfirm(false);

  const editHandler = (id) => {
    history.push(`/places/${id}`);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirm(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/places/${props._id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + token }
      );
      props.onDelete(props._id);
      dispatch({ type: "UPDATE_DELETED", payload: props._id });
    } catch (err) {
      setIsError(true);
    }
  };

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  return (
    <>
      <ModalLoader isLoading={isLoading} />
      <ModalError isError={isError} errorHandler={errorHandler} error={error} />

      <ModalConfirm
        showConfirm={showConfirm}
        closeDeleteHandler={closeDeleteHandler}
        confirmDeleteHandler={confirmDeleteHandler}
      />

      <ModalMap
        showMap={showMap}
        closeMapHandler={closeMapHandler}
        title={props.title}
        location={props.location}
        address={props.address}
      />

      <div className="col s6 offset-s3">
        <div className="card">
          <div className="card-image">
            <div className="image-overlay">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${props.image}`}
                alt={props.title}
              />
            </div>
            <span className="card-title">{props.title}</span>
          </div>
          <div className="card-content">
            <p>{props.description}</p>
          </div>
          <div className="card-action">
            <div>
              <i className="material-icons clickable" onClick={openMapHandler}>
                location_on
              </i>
              <span className="card-address" onClick={openMapHandler}>
                {props.address}
              </span>
            </div>
            {userId === props.creator && (
              <div className="card-options">
                <i
                  className="material-icons clickable"
                  onClick={() => editHandler(props._id)}
                >
                  mode_edit
                </i>
                <i
                  className="material-icons clickable"
                  onClick={openDeleteHandler}
                >
                  delete
                </i>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceItem;
