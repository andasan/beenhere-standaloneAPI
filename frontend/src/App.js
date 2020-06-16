import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch
} from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import { ModalLoader } from "./shared/components/Modals"

// import Users from './user-feature/container/Users';
// import NewPlace from './places-feature/container/NewPlace';
import MainHeader from './shared/components/MainHeader';
// import UserPlaces from './places-feature/container/UserPlaces'
// import UpdatePlace from './places-feature/container/UpdatePlace';
// import Auth from './user-feature/container/Auth';
import PrivateRoute from './shared/route/PrivateRoute';
import PublicRoute from './shared/route/PublicRoute';

const Users  = React.lazy(()=> import('./user-feature/container/Users'));
const NewPlace = React.lazy(()=> import('./places-feature/container/NewPlace'));
const UserPlaces  = React.lazy(()=> import('./places-feature/container/UserPlaces'));
const UpdatePlace  = React.lazy(()=> import('./places-feature/container/UpdatePlace'));
const Auth  = React.lazy(()=> import('./user-feature/container/Auth'));

const App = () => {
  return (
    <Router>
      <MainHeader />
      <Suspense fallback={<ModalLoader isLoading={true}  />}>
        <Switch>
          <PublicRoute restricted={false} path="/" exact component={Users} />
          <PublicRoute restricted={false} path="/:uid/places" component={UserPlaces} />
          <PrivateRoute path="/places/new" exact component={NewPlace} />
          <PrivateRoute path="/places/:pid" component={UpdatePlace} />
          <PublicRoute restricted={true} path="/auth" component={Auth} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
