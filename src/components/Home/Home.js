import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import Photo from './Photo';
import './Home.css';
import axios from 'axios'

function Home(props) {
  const [state, setState] = useState({
    search: '',
    photosDisplay: [],
    searchResult: null,
    authticationStatus: false,
  })

  useEffect(() => {
    if (!state.authticationStatus) {
      axios.get(API_BASE_URL + '/user/me', { headers: { 'Authorization': localStorage.getItem(ACCESS_TOKEN_NAME) } }, props.location.state)
      .then(function (response) {
        if (response.status !== 200) {
          redirectToLogin()
        } else {
          setState(prevState => ({
            ...prevState,
            authticationStatus: true
          }))
        }
      })
      .catch(function (error) {
        redirectToLogin()
      });
    }
  })
  function redirectToLogin() {
    props.history.push('/login');
  }

  function displayPhotos(photos) {
    let photosArray;
    photosArray = photos.map(photo =>
      <Photo url={photo.media.m} key={photo.link} title={photo.title} />
    );
    return photosArray
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    // console.log(state.search);
    setState(prevState => ({
      ...prevState,
      searchResult: <h3>Loading...</h3>
    }))
    if (state.authticationStatus) {
      axios.get(API_BASE_URL + '/search', { params: { tags: state.search } })
      .then(function (response) {
        if (response.status === 200) {
          let photos = response.data.items
          if (photos.length > 0) {
            setState(prevState => ({
              ...prevState,
              searchResult: null,
              photosDisplay: displayPhotos(photos)
            }))
          } else {
            setState(prevState => ({
              ...prevState,
              searchResult: <h3>No result</h3>
            }))
          }
        }
        else {
          props.showError("No results");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    } else {
      props.showError("Not Authorized"); 
    }
  }


  return (
    <div className="container">
      <div className="card col-12 mt-2 hv-center">
        <form className="search-form" onSubmit={handleSubmitClick} >
          <div className="form-group text-left">
            <label>Search Flickr by tags</label>
            <input id="search" type="search" name="search" className="form-control" placeholder="Search" onChange={handleChange} required value={state.search} />
            <button type="submit" className="search-button">
              <svg fill="#fff" height="24" viewBox="0 0 23 23" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </button>
            <small className="form-text text-muted">Enter tags you want to search, sperated by comma, tag mode is any</small>
          </div>
        </form>
      </div>
      <div>{state.searchResult}</div>
      <div>
        <div className="masonry">
          {state.photosDisplay}
        </div>
      </div>
    </div>
  )
}

export default withRouter(Home);