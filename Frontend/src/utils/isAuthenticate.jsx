import { Outlet } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt";
import NotFound from "../pages/invalid page/notFound";

const IsAuthenticate = () => {
  const token = localStorage.getItem("token");
  const check = decodeToken(token);

  return check && !isExpired(token) ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <NotFound />
  );
};

export default IsAuthenticate;
