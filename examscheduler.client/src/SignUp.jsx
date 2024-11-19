import React, {
    useState
}

    from "react";
import "./SignUp.css";

//const SignUp = () = > {
//    const [name, setName] = useState("");
//    const [email, setEmail] = useState("");
//    const [password, setPassword] = useState("");
//    const handleSignUp = async () => {
//        const payload =

//        {
//            name: name, email: email, password: password, role: email.includes("@student") ? "student" : email.includes("@usm") ? "professor" : "guest", group_id: email.includes("@student") ? 1 : null, // Exemplu: atribuie un ID doar pentru studenți
//        }

//            ;

//        try {
//            const response = await fetch("http://localhost:5000/api/Users", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                },
//                body: JSON.stringify(payload),
//            });
//            if (response.ok) {
//                const data = await response.json();
//                console.log("User signed up successfully:", data);
//                alert("Sign Up successful!");
//            }

//            else {
//                console.error("Failed to sign up user:", response.statusText);
//            }

//        }

//        catch (error) {
//            console.error("Error:", error);
//        }

//    }
//;

return (
    <div className="signup-container">
        <h1>Sign Up for ExamScheduler</h1>
        <form>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="button"
                className="signup-btn"
                //onClick={handleSignUp}
            >
                Sign Up
            </button>
        </form>
    </div>
);
};

export default SignUp;
