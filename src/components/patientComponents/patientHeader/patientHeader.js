import './patientHeader.scss';
import { Link, useLocation } from "react-router-dom";

const PatientHeader = ({patientIIN}) => {
    let location = useLocation();

    return (
      <div className="header_box">
        <nav className="navigation_box">
            <ul className='navbar'>
              <Link to={`/patient/${patientIIN}/account`} className={`navbar__element ${location.pathname === `/patient/${patientIIN}/account` ? "active" : ""}`}><li>ЛИЧНЫЙ КАБИНЕТ ПАЦИЕНТА</li></Link>
              <Link to={`/patient/${patientIIN}/tests`} className={`navbar__element ${location.pathname === `/patient/${patientIIN}/tests` ? "active" : ""}`}><li>ТЕСТЫ</li></Link>
            </ul>
        </nav>
      </div>
    );
  }
  
  export default PatientHeader;
