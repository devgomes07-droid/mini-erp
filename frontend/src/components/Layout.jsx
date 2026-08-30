import { useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const menu = [
    { label: "Produtos", path: "/produtos" },
    { label: "Pedidos", path: "/pedidos" },
    { label: "Clientes", path: "/clientes" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-mark">M</div>
          <span>Mini ERP</span>
        </div>

        <nav className="sidebar-nav">
          {menu.map(function (item) {
            const isActive = location.pathname === item.path;
            const classes = isActive ? "sidebar-link active" : "sidebar-link";
            return (
              <a key={item.path} href={item.path} className={classes}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;