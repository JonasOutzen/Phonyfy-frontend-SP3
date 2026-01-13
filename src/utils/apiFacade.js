const BASE_URL = "https://frontendexam.outzenprogramming.dk/api";
const LOGIN_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";
const SONGS_ENDPOINT = "/songs";

function handleHttpErrors(res) {
  if (!res.ok) {
    return res
      .json()
      .catch(() => ({}))
      .then((data) => Promise.reject({ status: res.status, body: data }));
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json().catch(() => null);
}


/* Insert utility-methods from later steps 
here (REMEMBER to uncomment in the returned 
object when you do)*/

const register = (username, password) => {
  const options = makeOptions("POST", false, { username, password });
  return fetch(BASE_URL + REGISTER_ENDPOINT, options)
    .then(handleHttpErrors) // expects json back
    .then((res) => {
      // backend returns token + username on register :contentReference[oaicite:4]{index=4}
      setToken(res.token);           // optional: auto-login after register
      return res;
    });
};


const setToken = (token) => {
  localStorage.setItem("jwtToken", token);
};

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

const loggedIn = () => {
  const loggedIn = getToken() != null;
  return loggedIn;
};

const logout = () => {
  localStorage.removeItem("jwtToken");
};

const login = (user, password) => {
  const options = makeOptions("POST", false, {
    username: user,
    password: password,
  });
  return fetch(BASE_URL + LOGIN_ENDPOINT, options)
    .then(handleHttpErrors)
    .then((res) => {
      setToken(res.token);
      return res;
    });
};

const fetchData = (endpoint, method) => {
  const optionObject = makeOptions(method, true);
  return fetch(BASE_URL + endpoint, optionObject)
  .then(res=>res.json());
};

const makeOptions = (method, addToken, body) => {
  var opts = {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };
  if (addToken && loggedIn()) {
    opts.headers["Authorization"] = `Bearer ${getToken()}`;
  }
  if (body) {
    opts.body = JSON.stringify(body);
  }
  return opts;
};

function getUserNameAndRoles(){
  const token = getToken()
  if (token != null) {
      const payloadBase64 = getToken().split('.')[1]
      const decodedClaims = JSON.parse(window.atob(payloadBase64))
      const roles = decodedClaims.roles
      const username = decodedClaims.username
      return [username, roles]
  } else return ""
}

const hasUserAccess = (neededRole) => {
  const token = getToken();
  if (!token) return false;

  const [, roles] = getUserNameAndRoles(); 
  const roleArr = Array.isArray(roles) ? roles : String(roles).split(",");

  return roleArr.includes(neededRole);
};

const PLAYLISTS_ENDPOINT = "/playlists";

const getMyPlaylists = () => {
  const options = makeOptions("GET", true);

  console.log("jwtToken in LS:", getToken());
  console.log("Request headers:", options.headers);

  return fetch(BASE_URL + PLAYLISTS_ENDPOINT + "/me", options).then(handleHttpErrors);
};

const createPlaylist = ({ name, description, img }) => {
  const options = makeOptions("POST", true, { name, description, img });
  return fetch(BASE_URL + PLAYLISTS_ENDPOINT, options).then(handleHttpErrors);
};

const getPlaylistById = (playlistId) => {
  const options = makeOptions("GET", true);
  return fetch(BASE_URL + PLAYLISTS_ENDPOINT + `/${playlistId}`, options).then(handleHttpErrors);
};

const addSongToPlaylist = (playlistId, songId) => {
  const options = makeOptions("POST", true, { songId });
  return fetch(BASE_URL + PLAYLISTS_ENDPOINT + `/${playlistId}/songs`, options).then(handleHttpErrors);
};

const removeSongFromPlaylist = (playlistId, songId) => {
  const options = makeOptions("DELETE", true);
  return fetch(BASE_URL + PLAYLISTS_ENDPOINT + `/${playlistId}/songs/${songId}`, options).then(handleHttpErrors);
};

const deletePlaylist = (playlistId) => {
  const options = makeOptions("DELETE", true);
  return fetch(BASE_URL + PLAYLISTS_ENDPOINT + `/${playlistId}`, options).then(handleHttpErrors);
};

const getSongsAndArtists = async () => {
  const res = await fetch("/data/db.json");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return Promise.reject({ status: res.status, body });
  }
  const data = await res.json();
  return { songs: data.songs ?? [], artists: data.artists ?? [] };
};


const facade = {
  makeOptions,
  setToken,
  getToken,
  loggedIn,
  login,
  logout,
  fetchData,
  getUserNameAndRoles,
  hasUserAccess,
  register,

  // playlists
  getMyPlaylists,
  createPlaylist,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getSongsAndArtists,
};

export default facade;