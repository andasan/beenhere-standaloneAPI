import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";

import CustomTextInput from "../../shared/components/CustomTextInput";
import CustomImageInput from "../../shared/components/CustomImageInput";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { ModalError, ModalLoader } from "../../shared/components/Modals";
import { newplaceValidationSchema } from "../../util/validators"

const NewPlace = () => {
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { userId, token } = useSelector((state) => state);

  const history = useHistory();

  const placeSubmitHandler = async (values) => {
    const formData = new FormData(); //built into browser and JavaScript
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("creator", values.creator);
    formData.append("image", values.file);

    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/places/`, "POST", formData, {
        Authorization: "Bearer " + token, 
      });

      history.push(`/${userId}/places`);
    } catch (err) {
      setIsError(true);
    }
  };

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  return (
    <div>
      <ModalLoader isLoading={isLoading} />
      <ModalError isError={isError} errorHandler={errorHandler} error={error} />

      <Formik
        initialValues={{
          title: "",
          description: "",
          address: "",
          creator: userId,
          file: undefined,
        }}
        validationSchema={newplaceValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm, submitForm }) => {
          resetForm();
          setSubmitting(false);
          submitForm();
          placeSubmitHandler(values);
        }}
      >
        {({
          errors,
          touched,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => {
          return (
            <div className="row">
              <div className="col s6 offset-s3">
                <Form>
                  <h1>Create a Place</h1>

                  <Field
                    name="file"
                    component={CustomImageInput}
                    title="Select a file"
                    setFieldValue={setFieldValue}
                    errorMessage={errors["file"] ? errors["file"] : undefined}
                    touched={touched["file"]}
                    style={{ display: "flex" }}
                    onBlur={handleBlur}
                  />

                  <CustomTextInput label="Title" name="title" type="text" />
                  <CustomTextInput
                    label="Description"
                    name="description"
                    type="textarea"
                  />
                  <CustomTextInput label="Address" name="address" type="text" />
                  <button
                    className="waves-effect waves-light btn white-text green darken-4"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Loading..." : "Submit"}
                    <i className="material-icons right">send</i>
                  </button>
                </Form>
              </div>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewPlace;
