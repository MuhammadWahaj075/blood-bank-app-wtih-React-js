
import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  list,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import NavBar from "../../components/navBar/NavBar";
import { auth, storage } from "../../firebase/firebase";


export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [file, setFile] = useState([]);
  console.log("🚀 ~ file: Home.jsx:18 ~ Home ~ file", file);

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
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
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
    <NavBar profile={file[0]} />
  </div>
  <div>

  </div>
    </div>
  )
}
