import React from "react";
import Loader from "react-loader-spinner";
import Modal from "react-modal";

import Map from "../../shared/components/Map";
Modal.setAppElement("#modal-root");

export const ModalError = (props) => (
  <Modal
    isOpen={props.isError}
    style={CustomStylesError}
    onRequestClose={props.errorHandler}
  >
    <div className="modal-header">
      <h3>An error occurred:</h3>
    </div>
    <div className="modal-content">{props.error}</div>
    <button
      className="waves-effect waves-light btn-small deep-orange-text white right"
      onClick={props.errorHandler}
    >
      close
    </button>
  </Modal>
);

export const ModalConfirm = (props) => (
  <Modal
    isOpen={props.showConfirm}
    onRequestClose={props.closeDeleteHandler}
    style={CustomStylesConfirm}
    contentLabel="Delete a place warning"
  >
    <div className="modal-header">
      <h1>Are you sure?</h1>
    </div>
    <div className="modal-content">
      You are about to delete a place. Are you sure you want to that?
    </div>
    <div className="row"></div>
    <div className="modal-footer">
      <button
        className="waves-effect waves-light btn-small deep-orange-text white"
        onClick={props.closeDeleteHandler}
      >
        Cancel
      </button>
      <button
        className="waves-effect waves-light btn-small white-text deep-orange accent-4"
        onClick={props.confirmDeleteHandler}
      >
        Delete
      </button>
    </div>
  </Modal>
);

export const ModalMap = (props) => (
  <Modal
    isOpen={props.showMap}
    onRequestClose={props.closeMapHandler}
    style={CustomStylesMap}
    contentLabel={props.title}
  >
    <Map coords={props.location} />
    <div className="row"></div>
    <div className="modal-footer">
      {props.address}
      <button
        className="waves-effect waves-light btn-small deep-orange-text white right"
        onClick={props.closeMapHandler}
      >
        close
      </button>
    </div>
  </Modal>
);

export const ModalLoader = (props) => (
  <Modal isOpen={props.isLoading} style={CustomStylesSpinner}>
    <Loader
      type="BallTriangle"
      color="#FFFFFF"
      height={200}
      width={200}
      timeout={0}
      visible={props.isLoading}
    />
  </Modal>
);

const CustomStylesError = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: "999",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    backgroundColor: "red",
    color: "white",
    border: "none",
    transform: "translate(-50%,-50%)",
    zIndex: "1000",
  },
};

const CustomStylesConfirm = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const CustomStylesMap = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "90%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};


const CustomStylesSpinner = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: "999",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    backgroundColor: "rgba(0,0,0,0)",
    border: "none",
    transform: "translate(-50%,-50%)",
    zIndex: "1000",
  },
};