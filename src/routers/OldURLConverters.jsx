import { Redirect, useLocation } from "react-router-dom";

export const RedirectCollection = () => {
  const {pathname} = useLocation();

  return (
    <Redirect
      to={{
        pathname: "/collection",
        search: `?c=${pathname.substring(pathname.lastIndexOf("/") + 1)}`,
      }}
    />
  );
};
