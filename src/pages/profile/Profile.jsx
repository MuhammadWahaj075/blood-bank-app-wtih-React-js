import React, { useEffect, useState } from "react";
import { PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import NavBar from "../../components/navBar/NavBar";
import { auth, db, storage } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import city from "./cities.json";

import "./style.css";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup.object({
  name: yup.string().required(),
  // : yup.string().required(),
  age: yup
    .number()
    .required("Age is required")
    .min(18, "you must be at least 18 years old")
    .max(99),
  number: yup
    .string()
    .required()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/,
      "Contact is not valid!."
    ),
  bloodType: yup.string().required("Blood type is a required field"),
  city: yup.string().required("city is a required field"),
  available: yup.bool().required(),
});

const theme = createTheme();
export default function Profile() {
  const [skeleton, setSkeleton] = useState(false);
  const [file, setFile] = useState([]);
  const [userName, setUserName] = useState("");
  // console.log("🚀 ~ file: Home.jsx:18 ~ Home ~ file", file);
  const navigate = useNavigate();
  // const [available, setAvailable] = useState(false);
  // console.log("🚀 ~ file: Profile.jsx:47 ~ Profile ~ availables:", available);

  // const [value, setValue] = useState({
  //   name: "",
  //   age: "",
  //   gender: "Male",
  //   bloodType: "",
  //   city: "",
  //   number: "",
  //   available: false,
  // });

  // console.log("value", value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "Male",
      bloodType: "",
      city: "",
      number: "",
      available: false,
    },

    resolver: yupResolver(schema),
  });
  console.log(errors);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    console.log(data, "data======");
    const q = query(
      collection(db, "Profile"),
      where("number", "==", data.number)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      try {
        const docRef = await addDoc(collection(db, "Profile"), {
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodType: data.bloodType,
          available: data.available,
          city: data.city,
          number: data.number,
        });
        console.log("Document written with ID: ", docRef.id);
        navigate("/donor")
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
          title: "Updated profile successfully",
        });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e,
        });
        console.error("Error adding document: ", e);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Number already exists",
      });
    }

    // console.log(value);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   let unsubscribe = null;

  //   const q = query(collection(db, "Profile"));
  //   unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach(async (doc) => {
  //       if (value.number === doc.data().number) {
  //         console.log("already exist");
  //       } else {
  //         try {

  //         } catch (e) {

  //         }
  //       }
  //     });
  //   });

  //   return () => {
  //     unsubscribe();
  //   };

  //   console.log(value);
  // };
  const currencies = [
    {
      value: "A+",
    },
    {
      value: "A-",
    },
    {
      value: "B+",
    },
    {
      value: "B-",
    },
    {
      value: "AB+",
    },
    {
      value: "AB-",
    },
    {
      value: "O+",
    },
    {
      value: "O-",
    },
  ];

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const imageListRef = ref(storage, "UserProfile/");
  function handleUpload() {
    if (!file) {
      alert("Please choose a file first!");
    }

    const storageRef = ref(storage, `/UserProfile/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",

      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          alert("upload image");
          console.log(url);
        });
      }
    );
  }

  useEffect(() => {
    setSkeleton(true);

    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setSkeleton(false);
          setFile((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(
        "🚀 ~ file: Home.jsx:59 ~ auth.onAuthStateChanged ~ user",
        user
      );
      if (!user) {
        setUserName(user.displayName);
      } else {
        setUserName("");
      }
    });
  }, []);

  return (
    <div>
      <div>
        <div>
          <NavBar profile={file[0]} />
        </div>
        {/* <h1 color="black">hello my name is {userName} </h1> */}(
        <Paper
          sx={{
            width: "50%",
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            ml: { xl: "32rem", md: "22rem" },
            mt: { xl: "3rem", md: "3rem" },
          }}
          elevation={7}
        >
          <Stack>
            <Stack
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  border: "4px solid #cddc39",
                  padding: "2px",
                  borderRadius: "50%",
                  borderTopColor: "#ff5722",
                  borderLeftColor: "#ff5722",

                  marginTop: "1rem",
                  marginLeft: "1rem",
                  filter: "drop-shadow(0 0 5px #ff5722)",
                }}
                width={200}
                height={200}
                src={file[0]}
                alt=""
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <PhotoCamera />
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleChange}
                />
              </IconButton>
              <button className="button-30" onClick={handleUpload}>
                Upload
              </button>

              <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Register as Donor
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            autoComplete="off"
                            fullWidth
                            name="name"
                            id="name"
                            label="Name"
                            autoFocus
                            // value={value.name}
                            // onChange={(e) =>
                            //   setValue({ ...value, name: e.target.value })
                            // }
                            {...register("name", {
                              required: "name is required",
                            })}
                          />
                          <p className="validate-error">
                            {errors.name?.message}
                          </p>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            type="number"
                            fullWidth
                            id="age"
                            label="Age"
                            name="age"
                            autoComplete="off"
                            // value={value.age}
                            // onChange={(e) =>
                            //   setValue({ ...value, age: e.target.value })
                            // }
                            {...register("age", {
                              required: "age is required",
                            })}
                          />
                          <p className="validate-error">
                            {errors.age?.message}
                          </p>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            // value={value.city}
                            // onChange={(e) =>
                            //   setValue({
                            //     ...value,
                            //     city: e.target.value,
                            //   })
                            // }
                            {...register("city", {
                              required: "city is required",
                            })}
                            id="filled-select-currency-native"
                            select
                            label="City"
                            defaultValue="city"
                            SelectProps={{
                              native: true,
                            }}
                            variant="outlined"
                          >
                            <option value=""></option>
                            {city.map((e, i) => {
                              return <option key={i}>{e.name}</option>;
                            })}
                          </TextField>
                          <p className="validate-error">
                            {" "}
                            {errors.city?.message}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            type="number"
                            autoComplete="off"
                            name="number"
                            fullWidth
                            id="number"
                            label="Number"
                            autoFocus
                            // value={value.number}
                            // onChange={(e) =>
                            //   setValue({ ...value, number: e.target.value })
                            // }
                            {...register("number", {
                              required: "number is required",
                            })}
                          />
                          <p className="validate-error">
                            {errors.number?.message}
                          </p>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">
                              Gender
                            </FormLabel>
                            <RadioGroup
                              // value={value.gender}

                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="female"
                              name="radio-buttons-group"
                              // onChange={(e) =>
                              //   setValue({ ...value, gender: e.target.value })
                              // }
                            >
                              <FormControlLabel
                                value="female"
                                control={<Radio />}
                                label="Female"
                              />
                              <FormControlLabel
                                value="male"
                                control={<Radio />}
                                label="Male"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { m: 1, width: "25ch" },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <Grid item xs={12}>
                              <TextField
                                // onChange={(e) =>
                                //   setValue({
                                //     ...value,
                                //     bloodType: e.target.value,
                                //   })
                                // }
                                {...register("bloodType", {
                                  required: "blood type is required",
                                })}
                                id="filled-select-currency-native"
                                select
                                label="Blood Group"
                                defaultValue="EUR"
                                SelectProps={{
                                  native: true,
                                }}
                                variant="outlined"
                              >
                                <option value=""></option>
                                {currencies.map((option) => (
                                  <option key={option.value}>
                                    {option.value}
                                  </option>
                                ))}
                              </TextField>
                            </Grid>
                            <p className="validate-error">
                              {errors.bloodType?.message}
                            </p>
                          </Box>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...register("available", {
                                    required: "available type is required",
                                  })}
                                />
                              }
                              label="Available"
                            />
                          </FormGroup>
                        </Grid>
                      </Grid>
                      <span className="validate-error">
                        {errors.available?.message}
                      </span>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          background: "red",
                          color: "#fff",
                          "&:hover": {
                            color: "#fff",
                            background: "red",
                          },
                        }}
                      >
                        updateProfile
                      </Button>
                    </form>
                  </Box>
                </Container>
              </ThemeProvider>
            </Stack>
          </Stack>
        </Paper>
      </div>
    </div>
  );
}
