import { CircularProgress } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../../firebase/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./style.css";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is a required field")
    .email("Email is not valid!."),
  password: yup.string().min(6),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: yupResolver(schema),
  });
  console.log(errors);

  const onSubmit = async (data) => {
    console.log(data, "data========");
    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (result) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
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
      }
      console.log(JSON.stringify(result.user.email));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err,
      });
    }
  };

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

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        // onChange={(e) => setEmail(e.target.value)}
                        {...register("email", {
                          required: "email is required",
                        })}
                      />

                      <p
                        style={{
                          color: "red",
                          fontSize: "0.9rem",
                          marginRight: "21rem",
                        }}
                      >
                        {" "}
                        {errors.email?.message}
                      </p>
                      <label className="form-label" for="typeEmailX">
                        Email
                      </label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        // onChange={(e) => setPassword(e.target.value)}
                        {...register("password", {
                          required: "password is required",
                        })}
                      />
                      <p
                        style={{
                          color: "red",
                          fontSize: "0.9rem",
                          marginRight: "20rem",
                        }}
                      >
                        {" "}
                        {errors.password?.message}
                      </p>
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
                  </form>
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
