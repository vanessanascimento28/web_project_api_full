import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../utils/auth";
import vectorIcon from "../../../images/Vector.svg";

function Register({ setTooltipOpen, setTooltipSuccess, setTooltipMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await register({ email, password });
      const returnData = await response.json();

      if (!response.ok) {
        throw new Error(returnData.error || "Erro desconhecido ao registrar.");
      }

      if (!returnData.data?.email || !returnData.data?._id) {
        throw new Error("Dados incompletos no retorno da API.");
      }

      setTooltipSuccess(true);
      setTooltipMessage("Vitória, faça seu login!");
      setTooltipOpen(true);
      navigate("/login");

    } catch (error) {
      console.error("[REGISTER] - Erro:", error);
      setTooltipSuccess(false);
      setTooltipMessage("Ops! Algo deu errado no cadastro.");
      console.log('Abrindo tooltip')
      setTooltipOpen(true);
      console.log("TOOLTIP DEVERIA ABRIR AGORA");
    }
  }

  return (
    <div className="register">
      <header className="register__header">
        <img
          className="header__logo"
          src={vectorIcon}
          alt="escrita Around The U.S."
        />
        <Link to="/login" className="register__login-link">
          Faça o login
        </Link>
      </header>

      <form className="register__form" onSubmit={handleSubmit}>
        <h2 className="register__title">Inscrever-se</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="register__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="register__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register__button">
          Inscrever-se
        </button>
      </form>

      <div className="register__signin">
        <p>
          Já é um membro?{" "}
          <Link to="/login" className="register__signin-link">
            Faça o login aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
