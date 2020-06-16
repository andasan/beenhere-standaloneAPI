import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useField } from "formik";

const CustomTextInput = ({ label, setFieldValue, ...props }) => {
  const [field, meta] = useField(props);

  switch (props.type) {
    case "text":
      return (
        <div className="input-field col s12">
          <input {...field} {...props} />
          <label
            className="white-text active"
            htmlFor={props._id || props.name}
          >
            {label}
          </label>
          {meta.touched && meta.error ? (
            <span className="helper-text" data-error={meta.error}>
              {meta.error}
            </span>
          ) : null}
        </div>
      );
    case "email":
      return (
        <div className="input-field col s12">
          <input {...field} {...props} />
          <label
            className="white-text active"
            htmlFor={props._id || props.name}
          >
            {label}
          </label>
          {meta.touched && meta.error ? (
            <span className="helper-text" data-error={meta.error}>
              {meta.error}
            </span>
          ) : null}
        </div>
      );

    case "password":
      return (
        <div className="input-field col s12">
          <input {...field} {...props} />
          <label
            className="white-text active"
            htmlFor={props._id || props.name}
          >
            {label}
          </label>
          {meta.touched && meta.error ? (
            <span className="helper-text" data-error={meta.error}>
              {meta.error}
            </span>
          ) : null}
        </div>
      );

    default:
      return (
        <div className="input-field col s12">
          <TextareaAutosize
            className="materialize-textarea"
            {...field}
            {...props}
            id="text-area"
          />
          <label
            className="white-text active"
            htmlFor={props._id || props.name}
          >
            {label}
          </label>
          {meta.touched && meta.error ? (
            <div className="meta-error">{meta.error}</div>
          ) : null}
        </div>
      );
  }
};

export default CustomTextInput;
