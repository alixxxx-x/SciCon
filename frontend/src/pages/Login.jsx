import Form from "../components/Form";
import { Link } from "react-router-dom";

function Login() {
    return (
        <div style={{  color: "black",  padding: "40px", textAlign: "center", minHeight: "100vh", backgroundColor: "white"  }}>
            <h1 style={{ color: "black", marginBottom: "30px" }}>Login</h1>
            
        
            <div style={{  maxWidth: "400px", margin: "0 auto", background: "#f8f9fa", padding: "30px", borderRadius: "10px",   color: "black"}}>
                <Form route="/api/token/get/" method="login" />
            </div>
        
            <div style={{ marginTop: "30px" }}>
            <p style={{ color: "black" }}>Don't have an account?</p>
                <Link to="/register" style={{ display: "inline-block",  background: "#007bff", color: "white",  padding: "10px 20px",    borderRadius: "5px",  textDecoration: "none",  marginTop: "10px" }}>
                    Register Here
               </Link>
            </div>
        </div>
    );
}
export default Login;