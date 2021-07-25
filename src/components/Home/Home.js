import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/apiConstants";
import Photo from "./Photo";
import "./Home.css";
import axios from "axios";

function Home(props) {
  const [state, setState] = useState({
    search: "",
    photosDisplay: [],
    searchResult: null,
    authticationStatus: false,
  });

  useEffect(() => {
    if (!state.authticationStatus) {
      axios
        .get(
          API_BASE_URL + "/user/me",
          { headers: { Authorization: localStorage.getItem(ACCESS_TOKEN_NAME) } },
          props.location.state
        )
        .then(function (response) {
          if (response.status !== 200) {
            redirectToLogin();
          } else {
            setState((prevState) => ({
              ...prevState,
              authticationStatus: true,
            }));
          }
        })
        .catch(function (error) {
          redirectToLogin();
        });
    }
  });
  function redirectToLogin() {
    props.history.push("/login");
  }

  function displayPhotos(photos) {
    let photosArray;
    photosArray = photos.map((photo) => <Photo url={photo.media.m} key={photo.link} title={photo.title} />);
    return photosArray;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    // console.log(state.search);
    setState((prevState) => ({
      ...prevState,
      searchResult: <h3>Loading...</h3>,
    }));
    if (state.authticationStatus) {
      axios
        .get(API_BASE_URL + "/search", { params: { tags: state.search } })
        .then(function (response) {
          if (response.status === 200) {
            let photos = response.data.items;
            if (photos.length > 0) {
              setState((prevState) => ({
                ...prevState,
                searchResult: null,
                photosDisplay: displayPhotos(photos),
              }));
            } else {
              setState((prevState) => ({
                ...prevState,
                searchResult: <h3>No result</h3>,
              }));
            }
          } else {
            props.showError("No results");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      props.showError("Not Authorized");
    }
  };

  return (
    <div className="container">
      <div className="card col-12 mt-2 hv-center w3-card-4 searchFrame">
       
      {/* Search Form */}
        
          <form className="row" onSubmit={handleSubmitClick}>
            <input
              id="search"
              type="search"
              name="search"
              className="form-control mr-sm-2 inputBox"
              placeholder="Search Flickr by Tags"
              onChange={handleChange}
              required
              value={state.search}
            />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
      

        <small className="form-text text-muted">
          Enter tags you want to search, sperated by comma, tag mode is any
        </small>

      </div>
      <div>{state.searchResult}</div>
      <div>
        <div className="masonry">{state.photosDisplay}</div>
      </div>
    </div>
  );
}

export default withRouter(Home);
