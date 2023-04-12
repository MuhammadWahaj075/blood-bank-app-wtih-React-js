import { CircularProgress } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase/firebase";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./style.css";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .required("Email is a required field")
    .email("Email is not valid!."),
  number: yup
    .string()
    .required()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/,
      "Contact is not valid!."
    ),
  password: yup.string().min(6),
});

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [value, setValue] = useState({
  //   firstname: "",
  //   lastname: "",
  //   email: "",
  //   password: "",
  //   number: "",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      number: "",
    },

    resolver: yupResolver(schema),
  });
  console.log(errors);

  const onSubmit = (data) => {
    console.log(data, "valueee========");
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        setIsLoading(true);
        const user = res.user;
        try {
          const docRef = await addDoc(collection(db, "Users"), {
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            password: data.password,
            number: data.number,
          });

          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        updateProfile(user, {
          displayName: data.firstname,
        });

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
                  <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-outline form-white mb-4 mt-5">
                      <input
                        type="text"
                        id="typeEmailX"
                        autoComplete="off"
                        className="form-control form-control-lg"
                        // value={value.firstname}
                        // onChange={(e) =>
                        //   setValue({ ...value, firstname: e.target.value })
                        // }
                        {...register("firstName", {
                          required: "firstname is required",
                          min: 4,
                          max: 20,
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
                        {errors.firstName?.message}
                      </p>
                      <label className="form-label" for="typeEmailX">
                        First Name
                      </label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="typeLastNameX"
                        autoComplete="off"
                        className="form-control form-control-lg"
                        // value={value.lastname}
                        // onChange={(e) =>
                        //   setValue({ ...value, lastname: e.target.value })
                        // }
                        {...register("lastName", {
                          required: true,
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
                        {errors.lastName?.message}
                      </p>
                      <label className="form-label" for="typeEmailX">
                        Last Name
                      </label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        // value={value.email}
                        // onChange={(e) =>
                        //   setValue({ ...value, email: e.target.value })
                        // }
                        {...register("email", {
                          required: "email is required",
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
                        // value={value.password}
                        // onChange={(e) =>
                        //   setValue({ ...value, password: e.target.value })
                        // }
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
                    <div className="form-outline form-white mb-4">
                      <input
                        type="number"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        // value={value.number}
                        // onChange={(e) =>
                        //   setValue({ ...value, number: e.target.value })
                        // }
                        {...register("number", {
                          required: "contact is required",
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
                        {errors.number?.message}
                      </p>
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
                  </form>
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
