import * as Yup from "yup";

const FILE_SIZE = 3000000;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

export const newplaceValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("A title is required"),
  description: Yup.string().required("A description is required"),
  address: Yup.string().required("An address is required"),
  file: Yup.mixed()
    .required("Image is required")
    .test(
      "fileSize",
      "File too large. Image upload size limit is 3MB.",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(8, "Password has to be longer than 6 characters!")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

export const signinValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Must be at least 3 characters long"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  file: Yup.mixed()
    .required("Avatar is required")
    .test(
      "fileSize",
      "File too large. Image upload size limit is 3MB.",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  password: Yup.string()
    .min(8, "Password has to be longer than 6 characters!")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords are not the same!")
    .required("Password confirmation is required!"),
});