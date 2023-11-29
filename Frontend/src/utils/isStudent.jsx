import { Outlet } from "react-router-dom";
import { decodeToken, isExpired } from "react-jwt";
import NotFound from "../pages/invalid page/notFound";

const IsStudent = () => {
  const token = localStorage.getItem("token");
  const check = decodeToken(token);

  return check && !isExpired(token) && check.role == 3 ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <NotFound />
  );
};

export default IsStudent;
