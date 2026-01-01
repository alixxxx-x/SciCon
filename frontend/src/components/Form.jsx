import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACESS_TOKEN , REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";



function Form ({ route , method}) {
    const [username ,setUsername] = useState("");
    const [password ,setPassword] = useState("");
    const [loading ,setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    async function handleSubmit (e) {
        e.preventDefault();
        setLoading (true);
        try {
            const res = await api.post(royte , {username , password})
            if (method === "login") {
                localStorage.setItem(ACESS_TOKEN , res.data.accessToken);
                localStorage.setItem(REFRESH_TOKEN , res.data.refreshToken);
                navigate ("/");
            } else {
                navigate ("/login");
            }
        } catch (error) {
            alert (error)
        } finally {
            setLoading (false);
                  }
                                    };


    return (

<div className='wrapper'>
      <form>
        <h1> Login</h1>

        <div className='input-box'>
          <input type="text" placeholder='UserName' required />
          <FaUser className='Icon' />
        </div>

        <div className='input-box'>
          <input type="password" placeholder='Password' required />
          <FaLock className='Icon' />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href='#'> Forgot Password? </a>
        </div>

        <button type='submit'>Login</button>

        <div className="register-link">
          <p>
            Don't have an Account?
            <Link to="/register"> Register Now </Link>
          </p>
        </div>
      </form>
    </div>

    );
}
export default Form