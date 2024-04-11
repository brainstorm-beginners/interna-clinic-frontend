import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from "../login/loginPage";
import AuthProvider from "../../auth/authProvider";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage/>} />
            {/* <Route path="*" element={<Navigate to=""/>} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
