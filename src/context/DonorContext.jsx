import React, { createContext, useContext, useState } from "react";

const DonorContext = createContext();

function DonorContextProvider({ children }) {
  const [bloodType, setBloodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.value);
  };

  return (
    <DonorContext.Provider
      value={{
        bloodType,
        quantity,
        notes,
        setBloodType,
        setQuantity,
        setNotes,
        modalOpen,
        handleSubmit,
        toggleModal,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
}
function useDonorContext() {
  const context = useContext(DonorContext);
  if (context === undefined) {
    throw new Error(
      "useDonorContext must be used within a DonorContextProvider"
    );
  }
  return context;
}
export { DonorContextProvider, useDonorContext };
