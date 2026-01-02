import Form from "../components/Form";
import { Link } from "react-router-dom";

function Register() {
    return (
        <div style={{  color: "black", padding: "40px",  textAlign: "center",  minHeight: "100vh",  backgroundColor: "white"}}>
            <h1 style={{ color: "black", marginBottom: "30px" }}>Register</h1>
            
            <div style={{ maxWidth: "400px",   margin: "0 auto",   background: "#f8f9fa", padding: "30px", borderRadius: "10px",  color: "black"    }}>
                <Form route="/api/user/register/" method="register" />
            </div>
            
            <div style={{ marginTop: "30px" }}>
                <p style={{ color: "black" }}>Already have an account?</p>
                <Link to="/login" style={{display: "inline-block", background: "#28a745", color: "white",   padding: "10px 20px",    borderRadius: "5px",  textDecoration: "none",    marginTop: "10px"     }}>
                    Login Here
                </Link>
            </div>
        </div>
    );
}
export default Register;