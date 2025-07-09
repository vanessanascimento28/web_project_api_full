import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authorize } from "../../../utils/auth";
import vectorIcon from "../../../images/Vector.svg";

function Login({ setLoggedIn, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log("Start loading");
      const data = await authorize({ email, password });

      if (!data.token) {
        throw new Error("Token não encontrado");
      }

      localStorage.setItem("jwt", data.token);

      setLoggedIn(true);
      setCurrentUser((prev) => ({
        ...prev,
        email: email,
      }));

      navigate("/");
    } catch (error) {
      alert("Erro no login");
      console.log("[LOGIN] - Erro", error);
    } finally {
      console.log("Stop loading");
    }
  }

  return (
    <div className="login">
      <header className="login__header">
        <img
          className="header__logo"
          src={vectorIcon}
          alt="escrita Around The U.S."
        />
        <Link to="/login" className="login__link">
          Entrar
        </Link>
      </header>

      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Entrar</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="login__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="login__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login__button">
          Entrar
        </button>
      </form>
      <div className="login__signin">
        <p>
          Ainda não é membro?{" "}
          <Link to="/register" className="login__signup-link">
            Inscreva-se aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
