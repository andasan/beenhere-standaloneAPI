import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";

import CustomTextInput from "../../shared/components/CustomTextInput";
import CustomImageInput from "../../shared/components/CustomImageInput";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { ModalError, ModalLoader } from "../../shared/components/Modals";
import {
  loginValidationSchema,
  signinValidationSchema,
} from "../../util/validators";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const dispatch = useDispatch();

  const history = useHistory();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (values) => {
    if (isLoginMode) {
      try {
        const fetchedUser = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          { "Content-Type": "application/json" }
        );

        dispatch({
          type: "LOGIN",
          payload: {
            user: fetchedUser.user,
            userId: fetchedUser.user._id,
            token: fetchedUser.token,
          },
        });
      } catch (err) {
        setIsError(true);
      }
    } else {
      const formData = new FormData(); //built into browser and JavaScript
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("image", values.file);
      formData.append("password", values.password);

      try {
        const fetchedUser = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
          "POST",
          formData //formData includes the headers
        );

        history.push(`/`);
        dispatch({
          type: "LOGIN",
          payload: {
            user: fetchedUser.user,
            userId: fetchedUser.user._id,
            token: fetchedUser.token,
          },
        });
      } catch (err) {
        setIsError(true);
      }
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

      <Formik
        initialValues={{
          username: "",
          email: "",
          file: undefined,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={
          !isLoginMode ? signinValidationSchema : loginValidationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm, submitForm }) => {
          setSubmitting(false);
          resetForm();
          submitForm();
          authSubmitHandler(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
          resetForm,
        }) => {
          return (
            <>
              <div className="row">
                <div className="col s6 offset-s3">
                  <Form>
                    <h1>{isLoginMode ? "Sign In" : "Sign Up"}</h1>

                    {!isLoginMode && (
                      <Field
                        name="file"
                        component={CustomImageInput}
                        title="Select a file"
                        setFieldValue={setFieldValue}
                        errorMessage={
                          errors["file"] ? errors["file"] : undefined
                        }
                        touched={touched["file"]}
                        style={{ display: "flex" }}
                        onBlur={handleBlur}
                      />
                    )}

                    {!isLoginMode && (
                      <CustomTextInput
                        label="Username"
                        name="username"
                        type="text"
                      />
                    )}

                    <CustomTextInput label="Email" name="email" type="email" />

                    <CustomTextInput
                      label="Password"
                      name="password"
                      type="password"
                    />
                    {!isLoginMode && (
                      <CustomTextInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                      />
                    )}

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
              </div>
              <div className="divider row"></div>
              <div className="col s6 offset-s3 center white-text">
                {isLoginMode
                  ? "Don't have an account yet? "
                  : "Already have an account? "}
                <button
                  className="waves-effect waves-light btn-small deep-orange-text white accent-2 center"
                  type="reset"
                  onClick={() => {
                    switchModeHandler();
                    resetForm();
                  }}
                >
                  Switch to {isLoginMode ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default Auth;
