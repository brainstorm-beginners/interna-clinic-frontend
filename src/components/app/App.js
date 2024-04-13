import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from "../login/loginPage";
import PatientPage from "../patientComponents/patientPage/patientPage";
import AuthProvider from "../../auth/authProvider";
import './app.scss';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/patient/:patientIIN/*" element={<PatientPage/>} />
            {/* <Route path="*" element={<Navigate to=""/>} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
