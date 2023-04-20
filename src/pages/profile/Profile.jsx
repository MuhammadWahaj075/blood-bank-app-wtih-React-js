import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { NavLink, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import { useFormik } from "formik";
import * as Yup from "yup";

import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import cities from "../profile/cities.json";
import { auth, db, storage } from "../../firebase/firebase";
import Swal from "sweetalert2";
import NavBar from "../../components/navBar/NavBar";
import { PhotoCamera } from "@mui/icons-material";
import { IconButton, Paper, Stack } from "@mui/material";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(20).required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .min(18, "You must be at least 18 years old")
    .max(99),
  number: Yup.string()
    .matches(/^[0-9]{10}$/, "Please enter valid Phone Number")
    .required("Phone number is required"),
  cities: Yup.string().required("Cities is required"),
  blood: Yup.string().required("Blood Type is required"),
  gender: Yup.string().required("gender is required"),
  available: Yup.boolean(),
});

export default function SignUp() {
  const [skeleton, setSkeleton] = useState(false);
  const [file, setFile] = useState([]);
  const [userName, setUserName] = useState("");
  // console.log("🚀 ~ file: Home.jsx:18 ~ Home ~ file", file);
  const navigate = useNavigate();
  const {
    handleBlur,
    touched,
    handleSubmit,
    handleChange,
    errors,
    values,
  } = useFormik({
    initialValues: {
      name: "",
      age: "",
      number: "",
      gender: "male",

      cities: "",
      blood: "",
      available: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, action) => {
      console.log(values);

      const q = query(
        collection(db, "FormikUserPro"),
        where("number", "==", values.number)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        try {
          const docRef = await addDoc(collection(db, "FormikUserPro"), {
            name: values.name,
            age: values.age,
            gender: values.gender,
            number: values.number,
            available: values.available,
            blood: values.blood,
            cities: values.cities,
          });
          console.log("Document written with ID: ", docRef.id);
          action.resetForm();
          navigate("/donor");
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
    },
  });

  function handleProfile(event) {
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
    <>
      <NavBar profile={file[0]} />
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
                onChange={handleProfile}
              />
            </IconButton>
            <button className="button-30" onClick={handleUpload}>
              Upload
            </button>
          </Stack>
        </Stack>
      </Paper>

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
            <Avatar sx={{ m: 1, bgcolor: "red" }}>
              <BloodtypeIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register as Donor
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="off"
                    name="name"
                    fullWidth
                    id="name"
                    label="Name"
                    type="text"
                    autoFocus
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  <span style={{ color: "red" }}>
                    {errors.name && touched.name ? (
                      <span>{errors.name}</span>
                    ) : null}
                  </span>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="off"
                    name="age"
                    fullWidth
                    id="age"
                    label="Age"
                    type="number"
                    autoFocus
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.age}
                  />
                  <span style={{ color: "red" }}>
                    {errors.age && touched.age ? (
                      <span>{errors.age}</span>
                    ) : null}
                  </span>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="off"
                    name="number"
                    fullWidth
                    id="number"
                    label="Number"
                    type="number"
                    autoFocus
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.number}
                  />
                  <span style={{ color: "red" }}>
                    {errors.number && touched.number ? (
                      <span>{errors.number}</span>
                    ) : null}
                  </span>
                </Grid>

                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      Gender
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="male"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.gender}
                      name="gender"
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
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Blood Group
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="bloodGroup"
                      name="blood"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.blood}
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+ ">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="O+ ">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Cities
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Cities"
                      required
                      name="cities"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cities}
                    >
                      {cities.map((e, i) => {
                        return (
                          <MenuItem key={i} value={e.name}>
                            {e.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.available}
                          name="available"
                        />
                      }
                      label="Available"
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, boxShadow: 12, backgroundColor: "#d8363a",'&:hover': {
                  backgroundColor: '#d8363a',
                  boxShadow: 12,
                },}}
              >
                Update profile
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
