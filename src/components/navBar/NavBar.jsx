import React from "react";
import { useNavigate } from "react-router-dom";
import vite from "../../assets/bloodBank.png";
import { Stack } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";

export default function NavBar({ profile }) {
  let navigate = useNavigate();

  const handleClick = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
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
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg red">
        <div className="container-fluid">
          <div
            className="collaps e navbar-collapse"
            id="navbarSupportedContent"
          >
            <a className="navbar-brand mt-2 mt-lg-0" href="/dashboard">
              <img
                src={vite}
                alt="logo-image"
                loading="lazy"
                height={60}
                width={80}
              />
            </a>
            <Stack ml={{ md: "32rem", xl: "46rem" }}>
              <p
                style={{
                  fontFamily: "inherit",
                  marginTop: "1rem",
                  fontSize: "30px",
                  // color: "#000",
                  fontWeight: 700,
                }}
              >
                Blood Bank App
              </p>
            </Stack>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <a
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={profile}
                  className="rounded-circle"
                  alt="profile"
                  loading="lazy"
                  height={60}
                  width={60}
                  style={{
                    border: "4px solid #cddc39",
                    padding: "2px",
                    borderRadius: "50%",
                    borderTopColor: "#ff5722",
                    borderLeftColor: "#ff5722",
                    filter: "drop-shadow(0 0 5px #ff5722)",
                  }}
                />
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end row"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                <li>
                  <a className="dropdown-item" href="/profile">
                    My profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/donor">
                    Donor
                  </a>
                </li>

                <li>
                  <a onClick={handleClick} className="dropdown-item" href="">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
