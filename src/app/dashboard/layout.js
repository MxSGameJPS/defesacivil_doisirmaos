"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import {
  BarChart,
  Map,
  Home,
  AlertCircle,
  BellRing,
  Archive,
  Wrench,
  Info,
  User,
  LogOut,
  Users,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Basic auth check for prototype
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null; // loading

  const getPageTitle = () => {
    if (pathname === "/dashboard/censo") return "CENSO IBGE";
    if (pathname === "/dashboard/comunidades") return "Gestão de Comunidades";
    if (pathname === "/dashboard/nucleos-familiares")
      return "Núcleos Familiares";
    if (pathname === "/dashboard/ocorrencias") return "Ocorrências";
    if (pathname === "/dashboard/alertas-humanitarios")
      return "Alertas Humanitários";
    if (pathname === "/dashboard/inventario") return "Gestão de Inventário";
    if (pathname === "/dashboard/manutenimento") return "Manutenimento";
    if (pathname === "/dashboard/informacoes") return "Informações";
    if (pathname === "/dashboard/usuarios") return "Gestão de Usuários";
    return "Gestão de Bairros";
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>📦</div>
          <div>
            <div className={styles.logoTitle}>SISPDEC</div>
            <div className={styles.logoSub}>Defesa Civil Dois Irmãos</div>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}
          >
            <BarChart size={20} />
            Gestão de Bairros
          </Link>
          <Link
            href="/dashboard/comunidades"
            className={`${styles.navItem} ${pathname === "/dashboard/comunidades" ? styles.active : ""}`}
          >
            <Map size={20} /> Comunidades
          </Link>
          <Link
            href="/dashboard/nucleos-familiares"
            className={`${styles.navItem} ${pathname === "/dashboard/nucleos-familiares" ? styles.active : ""}`}
          >
            <Home size={20} /> Núcleos Familiares
          </Link>
          <Link
            href="/dashboard/ocorrencias"
            className={`${styles.navItem} ${pathname === "/dashboard/ocorrencias" ? styles.active : ""}`}
          >
            <AlertCircle size={20} /> Ocorrências
          </Link>
          <Link
            href="/dashboard/alertas-humanitarios"
            className={`${styles.navItem} ${pathname === "/dashboard/alertas-humanitarios" ? styles.active : ""}`}
          >
            <BellRing size={20} /> Alertas Humanitários
          </Link>
          <Link
            href="/dashboard/inventario"
            className={`${styles.navItem} ${pathname === "/dashboard/inventario" ? styles.active : ""}`}
          >
            <Archive size={20} /> Gestão de Inventário
          </Link>
          <Link
            href="/dashboard/manutenimento"
            className={`${styles.navItem} ${pathname === "/dashboard/manutenimento" ? styles.active : ""}`}
          >
            <Wrench size={20} /> Manutenimento
          </Link>
          <Link
            href="/dashboard/informacoes"
            className={`${styles.navItem} ${pathname === "/dashboard/informacoes" ? styles.active : ""}`}
          >
            <Info size={20} /> Informações
          </Link>
          <Link
            href="/dashboard/censo"
            className={`${styles.navItem} ${pathname === "/dashboard/censo" ? styles.active : ""}`}
          >
            <Map size={20} /> CENSO IBGE
          </Link>

          {(user?.role === "Secretario" || user?.login === "Secretario") && (
            <Link
              href="/dashboard/usuarios"
              className={`${styles.navItem} ${pathname === "/dashboard/usuarios" ? styles.active : ""}`}
            >
              <Users size={20} /> Gestão de Usuários
            </Link>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerAvatar}>
            <User size={20} />
          </div>
          <div className={styles.footerInfo}>
            <div className={styles.footerName}>Sistema</div>
            <div className={styles.footerDev}>
              Desenvolvido por Saulo Pavanello
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className={styles.mainWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.pageTitle}>{getPageTitle()}</div>
          <div className={styles.headerRight}>
            <button className={styles.iconButton}>
              <BellRing size={20} />
              <span className={styles.badge}>2</span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                <User size={20} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user.nome || "Administrador"}
                </span>
                <span className={styles.userRole}>SISTEMA</span>
              </div>
              <button
                onClick={handleLogout}
                className={styles.logoutBtn}
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
