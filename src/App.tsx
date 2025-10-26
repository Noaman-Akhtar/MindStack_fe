import Dashboard from "./pages/dashboards";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import { ProtectedRouter } from "./utils/ProtectedRoute";
import { LandingPage } from "./pages/landingPage";

function App(){
  const token = localStorage.getItem("token");
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={token ? <Navigate to="/dashboard"/>:<Navigate to="/signin"/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/landing" element={<LandingPage/>}/>
    <Route path="/dashboard" element={
      <ProtectedRouter><Dashboard/></ProtectedRouter>}/>
  </Routes>
  </BrowserRouter>
  

}  export default App;
