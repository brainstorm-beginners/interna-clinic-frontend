import './doctorHeader.scss';
import { Link, useLocation } from "react-router-dom";

const DoctorHeader = ({doctorIIN}) => {
    let location = useLocation();

    return (
      <div className="header_box">
        <nav className="navigation_box">
            <ul className='navbar'>
              <Link to={`/doctor/${doctorIIN}/account`} className={`navbar__element ${location.pathname === `/doctor/${doctorIIN}/account` ? "active" : ""}`}><li>ЛИЧНЫЙ КАБИНЕТ ВРАЧА</li></Link>
              <Link to={`/doctor/${doctorIIN}/patients`} className={`navbar__element ${location.pathname === `/doctor/${doctorIIN}/patients` ? "active" : ""}`}><li>ПАЦИЕНТЫ</li></Link>
            </ul>
        </nav>
      </div>
    );
  }
  
  export default DoctorHeader;
