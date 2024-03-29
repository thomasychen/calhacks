import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LikedSongs from "./components/LikedSongs";
import NavBar from "./components/NavBar";
import React, { useState, useEffect, createContext} from 'react';


const buttonStyle = {
  backgroundColor: "#009688",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  fontSize: 18,
  color: "#fff",
  fontWeight: "bold",
  alignSelf: "center",
  textTransform: "uppercase"
} 
export const MusicContext = createContext();


function App() {
  const CLIENT_ID = "77be3b537e7c4a049890a7bfe298fa41"
  const REDIRECT_URI = "https://d2eifirn80iw3n.cloudfront.net/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPES = "playlist-modify-private playlist-modify-public user-read-recently-played"

  const [token, setToken] = useState("")
  const [guest, setGuest] = useState(false)
  let sound = null;
  const logout = () => {
    sound.pause();
    setToken("")
    window.localStorage.removeItem("token")
    setGuest(false)
  }
  const handleGuestLogin = () => {
    setToken("Guest")
    setGuest(true)
  }
  const handleAudio = (audioObj) => {
    sound = audioObj;
  }
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
    console.log(token)
    setToken(token)
}, [])

const sendToPlaylist = (uri) => {
  if (!guest) {
    fetch("/data-right/save", {
      method: 'POST',
      body: JSON.stringify({
        songID: uri,
        userToken: token
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      console.log(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  } else {
    console.log('This action is disabled for guest users.')
  }
}

    if (!token && !guest) {
      return (
        <div className="App">
          <header className="App-header">
              <h1>DittyCal</h1>
                  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}><button style = {buttonStyle}>Login
                      to Spotify</button></a>
                      <button onClick={handleGuestLogin}>Guest Login (Liked songs only saved temporarily) </button>
          </header>
      </div>  
      )
  } else {
    return (
    <Router>
    <NavBar logoutAction = {logout}/>
      <Routes>
        <Route path="/" element={<Home handleLike = {sendToPlaylist} handleNewCard = {handleAudio}/>} />
        <Route path = "/liked" element = {<LikedSongs/>} />
      </Routes>
    </Router>
  );
  }
}

export default App;
