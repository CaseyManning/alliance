import { Link } from "react-router-dom";
import Logo from "./Logo";
import { destinations, links, NavbarProps } from "./Navbar";

const VerticalNavbar: React.FC<NavbarProps> = ({ currentPage }) => {
  return (
    <div className="flex flex-col font-itc w-[180px] bg-white border-r border-r-[#ddd] shadow-sm pl-[10px] h-screen text-left space-y-4 justify-center pl-6 sticky">
      <div className="absolute w-[100%] top-10 left-0 flex flex-row justify-center items-center">
        <Logo href="/" />
      </div>
      {links.map((link) => (
        <Link to={destinations[link]} key={link}>
          <p
            className={` p-2 m-0 ${
              currentPage === link ? "font-itc-bold bg-gray-100" : ""
            }`}
          >
            {link}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default VerticalNavbar;
