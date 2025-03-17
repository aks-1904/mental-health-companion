import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const user = null;
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between py-6 px-20 items-center">
      <div className="uppercase font-extrabold text-5xl">
        <h1>welnesai</h1>
      </div>
      <div className="text-lg font-medium">
        <ul className="flex gap-5">
          <li>
            <Link to={"/home"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About Us</Link>
          </li>
        </ul>
      </div>
      <div className="flex gap-5">
        {!user && (
          <>
            <Button
              onClick={() => navigate("/auth/login")}
              className="cursor-pointer"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth/register")}
              className="cursor-pointer"
              variant={"secondary"}
            >
              Register
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
