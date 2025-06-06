import Navbar from "../../components/Navbar";
import { NavbarPage } from "../../components/Navbar";
import LandingNavbar from "../../components/LandingNavbar";
import { useAuth } from "../../lib/AuthContext";
import { useParams } from "react-router";

const IssuePage: React.FC = () => {
  const { issue } = useParams();
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && (
        <Navbar currentPage={NavbarPage.Dashboard} format="horizontal" />
      )}
      {!isAuthenticated && <LandingNavbar />}
      <div className="flex flex-row min-h-screen">
        <p>{issue}</p>
      </div>
    </>
  );
};

export default IssuePage;
