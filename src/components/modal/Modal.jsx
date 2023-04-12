import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { useDonorContext } from "../../context/DonorContext";
import { Box, Button, Grid, TextField } from "@mui/material";
import "./style.css";

export default function Modal() {
  const {
    modalOpen,
    setModalOpen,
    toggleModal,
    bloodType,
    quantity,
    notes,
    setBloodType,
    setQuantity,
    setNotes,
    handleSubmit,
  } = useDonorContext();

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

  return (
    <>
      <MDBModal
        id="modal"
        tabIndex="-1"
        show={modalOpen}
        setShow={setModalOpen}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Donor Request Form</MDBModalTitle>
              <button
                className="btn-close"
                color="none"
                onClick={toggleModal}
              ></button>
            </MDBModalHeader>
            <MDBModalBody>
              <form>
                <label htmlFor="bloodType">Blood Type:</label>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Grid item xs={12}>
                    <TextField
                      required
                      onChange={(e) =>
                        setBloodType({
                          ...value,
                          bloodType: e.target.value,
                        })
                      }
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
                        <option key={option.bloodType}>{option.value}</option>
                      ))}
                    </TextField>
                  </Grid>
                </Box>
                <br />
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
                <br />
                <label htmlFor="notes">Notes:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
                <br />
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <Button
                sx={{
                  background: "red",
                  color: "#fff",
                  "&:hover": {
                    color: "#fff",
                    background: "red",
                  },
                }}
                onClick={toggleModal}
              >
                Close
              </Button>
              <Button
                sx={{
                  m: "0.5rem",
                  background: "limegreen",
                  color: "#fff",
                  "&:hover": {
                    color: "#fff",
                    background: "limegreen",
                  },
                  "&:focus": {
                    color: "#fff",
                    background: "green",
                  },
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
