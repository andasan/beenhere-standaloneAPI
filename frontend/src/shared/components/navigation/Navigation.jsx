import React from "react";
import { SideNav } from "react-materialize";
import { NavLink } from "react-router-dom";

import NavLinks from "./NavLinks";
import SideNavs from "./SideNavs";

const Navigation = () => {

  return (
    <>
      <nav className="navbar-fixed transparent" role="navigation">
        <div className="nav-wrapper container">
          <NavLink to="/" exact>
            <div id="logo-container" className="brand-logo">
              <img href="/" src="/beenherelogo.png" alt="" />
            </div>
          </NavLink>
          <ul className="right hide-on-med-and-down">
            <NavLinks />
          </ul>
        </div>
      </nav>
      <SideNav
        id="SideNav-10"
        options={{
          draggable: true,
        }}
        trigger={<i id="sidenavmenu-trigger" className="material-icons icon-white">menu</i>}
      >
        <SideNavs />
      </SideNav>
    </>
  );
};

export default Navigation;
