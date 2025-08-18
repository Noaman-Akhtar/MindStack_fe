import {Navigate} from "react-router-dom";

export function ProtectedRouter({children}:{children:React.ReactNode}){
    const token =localStorage.getItem("token");
    if(!token){
        return <Navigate to ="/signin" />

    }
    return children ;
}