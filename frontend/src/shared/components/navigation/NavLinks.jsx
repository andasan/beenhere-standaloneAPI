import React from "react";
import { Dropdown, Chip} from "react-materialize";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const NavLinks = (props) => {
  const { isLoggedIn, userId, userProfile } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <>
      <li>
        <NavLink to="/" exact>
          Feed
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/places`}>My Places</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add a Place</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">Auth</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <Dropdown
            id="Dropdown_6"
            options={{
              alignment: "left",
              inDuration: 150,
              outDuration: 250,
              coverTrigger: false,
            }}
            trigger={
              <Chip close={false} options={null}>
                <img
                  alt="Contact Person"
                  className="circle"
                  src={`${process.env.REACT_APP_BACKEND_URL}/${userProfile.image}`}
                />
                {userProfile.username}
              </Chip>
            }
          >
            <NavLink
              to=""
              onClick={() => {
                dispatch({ type: "LOGOUT" });
              }}
            >
              Logout
            </NavLink>
          </Dropdown>
        </li>
      )}
    </>
  );
};

export default NavLinks;
