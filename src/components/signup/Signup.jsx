import { CircularProgress } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./style.css";
import { Formik, Form, useFormik, Field, ErrorMessage } from "formik";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(5, "first name must be at least 5 characters")
    .required("first name is required"),
  lastName: yup
    .string()
    .min(3, "last name must be at least 3 characters")
    .required("last name is required"),
  email: yup.string().email().required("email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
    .required("Please enter your password"),
  number: yup
    .string()
    .required()
   .min(11, "please enter valid number").
   max(11, "please enter valid number")
});

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //   console.log(values, "valueee========");
  //   //

  return (
    <section className="vh-100 red">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                  <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      number: "",
                    }}
                    onSubmit={(values, action) => {
                      console.log(values);
                      action.resetForm();
                      createUserWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                      )
                        .then(async (res) => {
                          setIsLoading(true);
                          const user = res.user;
                          try {
                            const docRef = await addDoc(
                              collection(db, "Formik Users"),
                              {
                                firstname: values.firstName,
                                lastname: values.lastName,
                                email: values.email,
                                password: values.password,
                                number: values.number,
                              }
                            );

                            console.log(
                              "Document written with ID: ",
                              docRef.id
                            );
                          } catch (e) {
                            console.error("Error adding document: ", e);
                          }
                          updateProfile(user, {
                            displayName: values.firstname,
                          });

                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                              );
                              toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                              );
                            },
                          });

                          Toast.fire({
                            icon: "success",
                            title: "Signed in successfully",
                          });
                          navigate("/signin");
                          setIsLoading(false);
                        })
                        .catch((error) => {
                          setError(error.message);
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error,
                          });
                        });
                    }}
                  >
                    <Form>
                      <div className="form-outline form-white mb-4 mt-5">
                        <Field
                          type="text"
                          id="typeEmailX"
                          autoComplete="off"
                          className="form-control form-control-lg"
                          name="firstName"
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="firstName" />
                        </span>
                        <label className="form-label" for="typeEmailX">
                          First Name
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <Field
                          type="text"
                          id="typeLastNameX"
                          autoComplete="off"
                          className="form-control form-control-lg"
                          name="lastName"
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="lastName" />
                        </span>
                        <label className="form-label" for="typeEmailX">
                          Last Name
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <Field
                          type="email"
                          id="typeEmailX"
                          className="form-control form-control-lg"
                          name="email"
                          // onChange={handleChange}
                          // onBlur={handleBlur}
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="email" />
                        </span>
                        <label className="form-label" for="typeEmailX">
                          Email
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <Field
                          type="password"
                          id="typePasswordX"
                          className="form-control form-control-lg"
                          name="password"
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="password" />
                        </span>
                        <label className="form-label" for="typePasswordX">
                          Password
                        </label>
                      </div>
                      <div className="form-outline form-white mb-4">
                        <Field
                          type="number"
                          id="typePasswordX"
                          className="form-control form-control-lg"
                          name="number"
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="number" />
                        </span>
                        <label className="form-label" for="typePasswordX">
                          Contact
                        </label>
                      </div>

                      {/*  <p className="small mb-5 pb-lg-2">
                    <a className="text-white-50" href="#!">
                      Forgot password?
                    </a>
  </p> */}

                      <button
                        className="btn btn-outline-light btn-lg px-5"
                        type="submit"
                      >
                        {isLoading ? (
                          <CircularProgress
                            sx={{ fontSize: "1rem" }}
                            color="inherit"
                          />
                        ) : (
                          "Sign Up"
                        )}
                      </button>

                      <div className="d-flex justify-content-center text-center mt-4 pt-1">
                        <a href="#!" className="text-white">
                          <i className="fab fa-facebook-f fa-lg"></i>
                        </a>
                        <a href="#!" className="text-white">
                          <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                        </a>
                        <a href="#!" className="text-white">
                          <i className="fab fa-google fa-lg"></i>
                        </a>
                      </div>
                    </Form>
                  </Formik>
                </div>

                <div>
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/signin" className="text-white-50 fw-bold">
                      Login Here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
