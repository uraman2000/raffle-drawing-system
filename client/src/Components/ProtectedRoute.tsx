import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getAccess } from "../utils/localStorage";

interface IProps {
  component: any;
  path?: string | string[];
}

export default function ProtectedRoute({ component: Component, ...rest }: IProps) {
  return (
    <>
      <Route
        exact
        {...rest}
        render={({ location }) =>
          getAccess().access_token !== null ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    </>
  );
}
