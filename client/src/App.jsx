import { useDispatch } from 'react-redux';
import './App.css'
import Routes from "./Routes";
import { jwtDecode } from "jwt-decode";
import { clearUser, setUser } from './features/user/userSlice';
import { useCallback, useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch(error) {
      console.error("Invalid Token", error);
      return null;
    }
  }

  const isTokenExpired = useCallback((token) => {
    const decoded = decodeToken(token);
    if(!decoded) return true; // token expired

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log({token})

    if(token && !isTokenExpired(token)) {
      const user = decodeToken(token);
      console.log({user});
      dispatch(setUser(user));
    } else {
      localStorage.removeItem("token");
      dispatch(clearUser());
    }
  }, [dispatch, isTokenExpired])

  return (
    <>
      <Routes />
    </>
  )
}

export default App
