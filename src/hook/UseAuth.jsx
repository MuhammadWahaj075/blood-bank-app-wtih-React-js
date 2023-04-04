import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";


export default function useAuth() {
    
     const [currentUser, setCurrentUser] = useState();
     useEffect(() => {
       const unSubscribe = onAuthStateChanged(auth, (user) =>
         setCurrentUser(user)
       );
       return unSubscribe;
     }, []);
     return currentUser;
   }