import React from "react";
import "./Login.css";
import sample_img from "./assets/sample_img.jpeg"; // Importă imaginea folosind calea relativă
import { useNavigate } from "react-router-dom";


const Login = () => {
    //const navigate = useNavigate();

    return (
        <div className="container">

            {/* Secțiunea stângă */}
            <div className="left-section">         

                <form> 

                    <div>

                        <h1>Welcome to ExamScheduler!</h1>

                    </div>
                
                  
                    <div>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />

                    </div>
                    
                    <button 
                        type="button"
                        className="login-btn"
                        onClick={() => alert("Login clicked!")}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="signup-btn"
                         onClick={() => alert("Sign Up clicked!")}
                        //onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                  
                </form>
            </div>

            {/* Secțiunea dreaptă */}
            <div
                className="right-section"
                style={{
                    backgroundImage: `url(${sample_img})`, // Folosește imaginea ca fundal
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
        </div>
    );
};

export default Login;
