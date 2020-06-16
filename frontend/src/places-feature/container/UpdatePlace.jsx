import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import CustomTextInput from "../../shared/components/CustomTextInput";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { ModalError, ModalLoader } from "../../shared/components/Modals";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const [isError, setIsError] = useState(false);
  const placeId = useParams().pid;
  const history = useHistory();

  const {userId, token} = useSelector((state) => state);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  const placeUpdateSubmitHandler = async (e, value) => {
    e.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: value.title,
          description: value.description,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      );
      history.push(`/${userId}/places`);
    } catch (err) {
      setIsError(true);
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="row center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Must be more than 3 characters")
      .required("A title is require"),
    description: Yup.string().required("A description is required"),
  });

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  return (
    <div>
      <ModalLoader isLoading={isLoading} />
      <ModalError isError={isError} errorHandler={errorHandler} error={error} />

      {!isLoading && loadedPlace && (
        <Formik
          initialValues={loadedPlace}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm();
            setSubmitting(false);
          }}
        >
          {(props) => {
            return (
              <div className="row">
                <div className="col s6 offset-s3">
                  <Form onSubmit={(e) => placeUpdateSubmitHandler(e, props.values)}>
                    <h1>Edit a Place</h1>
                    <CustomTextInput label="Title" name="title" type="text" />
                    <CustomTextInput
                      label="Description"
                      name="description"
                      type="textarea"
                    />
                    {/* <CustomTextInput label="Address" name="address" type="text" /> */}
                    <button
                      className="waves-effect waves-light btn white-text green darken-4"
                      type="submit"
                      disabled={!!props.isSubmitting}
                    >
                      {props.isSubmitting ? "Loading..." : "Submit"}
                      <i className="material-icons right">send</i>
                    </button>
                  </Form>
                </div>
              </div>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default UpdatePlace;