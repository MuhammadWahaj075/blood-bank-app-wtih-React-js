import { Box, Link, Paper, TextField } from "@mui/material";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import NavBar from "../navBar/NavBar";

export default function Donor() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let unsubscribe = null;
    const getRealTimeData = async () => {
      const q = query(collection(db, "Profile"));
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

  const handleChange = (e) => {
    const searchInput = e.target.value;
    console.log(searchInput, "valuee=========");
    if (searchInput) {
      const searchData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchInput) ||
          item.bloodType.toUpperCase().includes(searchInput)

      );
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
            sx={{ mt: "2rem", ml: "30rem", width: "30vw" }}
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
            </tr>
          </thead>
          <tbody>
            {data.map((donor) => (
              <tr key={donor.id}>
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
                  {donor.bloodType}
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
                  {donor.city}
                </td>
                <td>
                  <Box sx={{ cursor: "pointer" }}>
                    <Link
                      sx={{
                        textDecoration: "none",
                        fontWeight: 700,
                        color: "green",
                        ml: 4,
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
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </>
  );
}
