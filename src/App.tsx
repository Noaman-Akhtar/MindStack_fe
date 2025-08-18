import Dashboard from "./pages/dashboards";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import { ProtectedRouter } from "./routes/ProtectedRoute";


function App(){
  const token = localStorage.getItem("token");
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={token? <Navigate to="/dashboard"/>:<Navigate to="/signup"/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/signin" element={<Signin/>}/>
    <Route path="/dashboard" element={
      <ProtectedRouter><Dashboard/></ProtectedRouter>}/>
  </Routes>
  </BrowserRouter>
  

}  export default App;
