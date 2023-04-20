import { Box, Button, Link, Paper, TextField } from "@mui/material";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import NavBar from "../navBar/NavBar";
import { useDonorContext } from "../../context/DonorContext";
import Modal from "../modal/Modal";
import Swal from "sweetalert2";

export default function Donor() {
  // const { toggleModal } = useDonorContext();

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [Donors, setDonors] = useState("");
  const [isDisabled, setIsDisabled] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    const getRealTimeData = async () => {
      const q = query(collection(db, "FormikUserPro"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const profile = [];
        querySnapshot.forEach((doc) => {
          profile.push(doc.data());
        });

        setData(profile);
        setFilterData(profile);
      });
    };
    getRealTimeData();
    return () => {
      unsubscribe();
    };
  }, []);
  const handleDonorReq = async (index) => {
    setIsDisabled(true)
    const donor = data[index];
    setDonors(donor);

    try {
      const docRef = await addDoc(collection(db, "DonorReq"), {
        Donors: Donors,
      });
      console.log("Document written with ID: ", docRef.id);
      setIsDisabled(false)
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
        title: "Donor request successfully",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e,
      });
      console.error("Error adding document: ", e);
    }
    console.log("🚀 ~ file: Donor.jsx:72 ~ handleDonorReq ~ donor:", donor)
  };

  const handleChange = (e) => {
    const searchInput = e.target.value;
    console.log(searchInput, "valuee=========");
    if (searchInput) {
      const searchData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchInput) ||
          item.bloodType.toUpperCase().includes(searchInput)
      );
      console.log("🚀 ~ file: Donor.jsx:48 ~ handleChange ~ data:", data);
      setData(searchData);
    } else {
      setData(filterData);
    }
    setSearch(searchInput);
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <Paper elevation={10}>
        <Box justifyContent="center" alignItems="center">
          <TextField
            variant="standard"
            value={search}
            onChange={(e) => handleChange(e)}
            sx={{ mt: "2rem", ml: "40rem", width: "30vw" }}
            label="Search Donor"
          />
        </Box>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact Number</th>
              <th>City</th>
              <th>Availability</th>
              <th>Request Donor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((donor, index) => (
              <tr key={index}>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.name}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.blood}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.age}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.gender}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.number}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {donor.cities}
                </td>
                <td>
                  <Box>
                    <Link
                      sx={{
                        textDecoration: "none",
                        fontWeight: 700,
                        color: "green",
                        ml: 4,
                        "&:hover": {
                          color: "green",
                        },
                      }}
                    >
                      {donor.available ? (
                        "Yes"
                      ) : (
                        <span style={{ color: "red" }}>No</span>
                      )}
                    </Link>
                  </Box>
                </td>

                <td>
                  <Box>
                    <Button
                      disabled={isDisabled ? true : false}
                      onClick={() => handleDonorReq(index)}
                      sx={{
                        cursor: "pointer",
                        textTransform: "capitalize",
                        background: "red",
                        color: "white",

                        "&:hover": {
                          color: "#fff ",
                          backgroundColor: "red !important",
                          boxShadow: 12,
                        },
                        "&:focus": {
                          color: "#fff",
                          backgroundColor: "red !important",
                        },
                      }}
                    >
                      Request Donor
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
            {/* <Modal toggleShow={toggleModal} /> */}
          </tbody>
        </table>
      </Paper>
    </>
  );
}
