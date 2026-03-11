"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Users,
  UserPlus,
  Trash2,
  ShieldAlert,
  X,
  ShieldCheck,
  UserCog,
  UserCheck,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    senha: "",
    role: "Agente",
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      setUsuarios(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      // Only Secretario can access
      if (user.role !== "Secretario" && user.login !== "Secretario") {
        setLoading(false);
      } else {
        fetchData();
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
        setFormData({ nome: "", login: "", senha: "", role: "Agente" });
      } else {
        setError(data.message || "Erro ao criar usuário");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erro ao excluir usuário");
    }
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>Validando permissões...</div>;

  // Final check for Secretario
  if (
    currentUser &&
    currentUser.role !== "Secretario" &&
    currentUser.login !== "Secretario"
  ) {
    return (
      <div className={styles.forbidden}>
        <ShieldAlert size={64} color="#ef4444" />
        <h2 style={{ marginTop: "1.5rem" }}>Acesso Restrito</h2>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
          Esta página é exclusiva para o **Secretário** da Defesa Civil.
        </p>
        <button
          className={styles.btn}
          style={{ marginTop: "2rem", background: "#f1f5f9", color: "#475569" }}
          onClick={() => router.push("/dashboard")}
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const getRoleClass = (role) => {
    if (role === "Secretario") return styles.roleSecretario;
    if (role === "Agente") return styles.roleAgente;
    if (role === "Assistente") return styles.roleAssistente;
    if (role === "Voluntário") return styles.roleVoluntario;
    if (role === "Sub-Secretário") return styles.roleSubSecretario;
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.title}>Gestão de Usuários</h1>
          <p className={styles.subtitle}>
            Gerencie quem possui acesso ao sistema SISPDEC
          </p>
        </div>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} /> Novo Usuário
        </button>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>Login / Usuário</th>
                <th>Cargo / Função</th>
                <th>Data de Cadastro</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: "700" }}>{u.nome}</td>
                  <td>{u.login}</td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${getRoleClass(u.role)}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: "center" }}>
                    {u.login !== "Secretario" ? (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <span title="Secretário Principal não pode ser removido">
                        <ShieldCheck size={18} color="#94a3b8" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3 className={styles.modalTitle}>Cadastrar Novo Usuário</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Preencha os dados abaixo para liberar o acesso
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <form onSubmit={handleCreate} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome Completo *</label>
                <input
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Login Principal *</label>
                <input
                  name="login"
                  required
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Ex: joao.silva"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Senha de Acesso *</label>
                <input
                  type="password"
                  name="senha"
                  required
                  value={formData.senha}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cargo / Função no Sistema *</label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="Agente">Agente</option>
                  <option value="Assistente">Assistente</option>
                  <option value="Voluntário">Voluntário</option>
                  <option value="Sub-Secretário">Sub-Secretário</option>
                  <option value="Secretario">Secretário</option>
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btn}
                  style={{ background: "#f1f5f9", color: "#64748b" }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cadastrando..." : "Confirmar Cadastro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
