import { useState } from "react";
import api from "../api";
import { Form, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function From ({ route, method}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading , setLoading] = useState();
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await api.post(route, { username, passord});

            if (method === "login") {
                localStorage.setItem(ACESS_TOKEN, response.data.access);
            }
        }
        catch (error){
            alert("An error occurred.");
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <form onSubmit= {handleSubmit} className="form-container"> 
            <h1>{name}</h1>

            <input 
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />

            <input 
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button className="form-button" type="submit" >
                
            </button>

        </form>
    );
}

export default Form;