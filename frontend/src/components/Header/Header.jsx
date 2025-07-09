import { useState, useEffect } from "react";
import vectorIcon from "../../images/Vector.svg";

function Header({ email, handleLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 680);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 680);
      if (window.innerWidth > 680) {
        setIsMobileMenuOpen(false); // fecha o menu se voltar pro desktop
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  return (
    <header className="header">
      {isMobile && isMobileMenuOpen && (
        <div className="header__mobile-menu">
         
          <p className="header__email">{email}</p>
          <button className="header__logout" onClick={handleLogout}>
            Logout
          </button>
           <hr className="header__line header__line--mobile" />
        </div>
      )}

    <div className="header__content">
  <div className="header__logo-container">
    <img
      className="header__logo"
      src={vectorIcon}
      alt="escrita Around The U.S."
    />
    {isMobile && (
      <button
        className="header__menu-toggle"
        onClick={toggleMenu}
        aria-label="Abrir/fechar menu"
      >
        {isMobileMenuOpen ? (
          <span className="header__close-icon">✕</span>
        ) : (
          <>
            <span className="header__menu-line" />
            <span className="header__menu-line" />
            <span className="header__menu-line" />
          </>
        )}
      </button>
    )}
  </div>

  {!isMobile && (
    <div className="header__container">
      <p className="header__email">{email}</p>
      <button className="header__logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )}
</div>

      <hr className="header__line" />
    </header>
  );
}

export default Header;
