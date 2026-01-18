import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
