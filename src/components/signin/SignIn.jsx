import { CircularProgress } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../../firebase/firebase";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import "./style.css";

const validationSchema = yup.object({
  email: yup.string().email().required("email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
    .required("Please enter your password"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
                  <h2 className="fw-bold mb-2 text-uppercase">Sign In</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>
                  <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    onSubmit={async (values, action) => {
                      console.log(values);
                      action.resetForm();
                      try {
                        setIsLoading(true);
                        const result = await signInWithEmailAndPassword(
                          auth,
                          values.email,
                          values.password
                        );
                        if (result) {
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
                          navigate("/dashboard");
                          setIsLoading(false);
                        } else {
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error,
                          });
                          setIsLoading(false);

                        }
                        console.log(JSON.stringify(result.user.email));
                      } catch (err) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: err,
                        });
                        setIsLoading(false);
                      }
                    }}
                  >
                    <Form>
                      <div className="form-outline form-white mb-4">
                        <Field
                          type="email"
                          id="typeEmailX"
                          className="form-control form-control-lg"
                          name="email"
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
                          // onChange={(e) => setPassword(e.target.value)}
                        />
                        <span style={{ color: "red" }}>
                          <ErrorMessage name="password" />
                        </span>
                        <label className="form-label" for="typePasswordX">
                          Password
                        </label>
                      </div>

                      {/* <p className="small mb-5 pb-lg-2">
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
                          "Login"
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
                    Don't have an account?{" "}
                    <a href="/" className="text-white-50 fw-bold">
                      Sign Up
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
