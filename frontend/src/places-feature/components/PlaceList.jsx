import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import PlaceItem from "./PlaceItem";

const PlaceList = (props) => {
  const creatorsId = useParams().uid;
  const {userId} = useSelector(state => state);

  if (props.places.length === 0) {
    return (
      <div className="row center">
        {userId === creatorsId ? (
          <>
            <h4>No Places found. Maybe create one?</h4>
            <NavLink to="/places/new">
              <div className="btn-floating btn-large">
                <i className="material-icons black">add</i>
              </div>
            </NavLink>
          </>
        ) : (
          <h4>No Places found.</h4>
        )}
      </div>
    );
  }

  return (
    <div className="row center">
        {props.places.map((place) => (
          <PlaceItem key={place._id} {...place} onDelete={props.onDeletePlace} />
        ))}
    </div>
  );
};

export default PlaceList;
