"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  X,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
} from "lucide-react";

export default function Manutenimento() {
  const [manutencoes, setManutencoes] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    item_id: "",
    tipo: "Corretiva",
    prioridade: "Média",
    descricao: "",
    data_solicitacao: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const [manutRes, invRes] = await Promise.all([
        fetch("/api/manutencoes"),
        fetch("/api/inventario"),
      ]);
      const [manutData, invData] = await Promise.all([
        manutRes.json(),
        invRes.json(),
      ]);
      setManutencoes(manutData);
      setInventario(invData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/manutencoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
        setFormData({
          item_id: "",
          tipo: "Corretiva",
          prioridade: "Média",
          descricao: "",
          data_solicitacao: new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = manutencoes.filter(
    (m) =>
      m.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.item_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.item_tombo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: manutencoes.length,
    pendentes: manutencoes.filter((m) => m.status === "Pendente").length,
    emAndamento: manutencoes.filter(
      (m) => m.status === "Agendado" || m.status === "Em Execução",
    ).length,
    concluidos: manutencoes.filter(
      (m) => m.status === "Concluido" || m.status === "Concluído",
    ).length,
  };

  const getStatusClass = (s) => {
    if (s === "Pendente") return styles.statusPendente;
    if (s === "Agendado") return styles.statusAgendado;
    if (s === "Em Execução") return styles.statusExecucao;
    if (s === "Concluído" || s === "Concluido") return styles.statusConcluido;
    return "";
  };

  const getPrioClass = (p) => {
    if (p === "Baixa") return styles.prioBaixa;
    if (p === "Média") return styles.prioMedia;
    if (p === "Alta") return styles.prioAlta;
    if (p === "Urgente") return styles.prioUrgente;
    return "";
  };

  if (loading)
    return (
      <div style={{ padding: "2rem" }}>
        Sincronizando registros de manutenção...
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Manutenimento</h1>
        <p className={styles.subtitle}>
          Gerencie manutenções preventivas e corretivas dos equipamentos da
          Defesa Civil
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total de Manutenções</span>
            <ClipboardList className={styles.statIcon} size={20} />
          </div>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statDesc}>registros</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Pendentes</span>
            <AlertTriangle className={styles.statIcon} size={20} />
          </div>
          <span className={styles.statValue}>{stats.pendentes}</span>
          <span className={styles.statDesc}>aguardando agendamento</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Em Andamento</span>
            <Clock className={styles.statIcon} size={20} />
          </div>
          <span className={styles.statValue}>{stats.emAndamento}</span>
          <span className={styles.statDesc}>agendados ou em execução</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Concluídos</span>
            <CheckCircle2 className={styles.statIcon} size={20} />
          </div>
          <span className={styles.statValue}>{stats.concluidos}</span>
          <span className={styles.statDesc}>histórico</span>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "800" }}>
              Manutenimento
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Gerencie manutenções preventivas e corretivas dos equipamentos
            </p>
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Solicitar Manutenção
          </button>
        </div>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar por código, item ou código do item..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Item</th>
                <th>Cód. Item</th>
                <th>Tipo</th>
                <th>Solicitação</th>
                <th>Agendamento</th>
                <th>Técnico</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Custo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: "700" }}>{m.codigo}</td>
                  <td>{m.item_nome}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {m.item_tombo}
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${m.tipo === "Preventiva" ? styles.typePrev : styles.typeCorr}`}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td>{new Date(m.data_solicitacao).toLocaleDateString()}</td>
                  <td>
                    {m.data_agendamento
                      ? new Date(m.data_agendamento).toLocaleDateString()
                      : "--"}
                  </td>
                  <td>{m.tecnico || "--"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${getPrioClass(m.prioridade)}`}
                    >
                      {m.prioridade}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${getStatusClass(m.status)}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: "700" }}>
                    {parseFloat(m.custo) > 0
                      ? `R$ ${parseFloat(m.custo).toFixed(2)}`
                      : "--"}
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
                <h3 className={styles.modalTitle}>Solicitar Manutenção</h3>
                <p className={styles.modalSubtitle}>
                  Registre uma nova necessidade técnica no inventário
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

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Selecione o Item do Inventário *</label>
                <select
                  name="item_id"
                  required
                  value={formData.item_id}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um item...</option>
                  {inventario.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nome} ({i.num_tombo || "Sem Tombo"})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className={styles.formGroup}>
                  <label>Tipo de Manutenção *</label>
                  <select
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    <option value="Corretiva">Corretiva (Urgente)</option>
                    <option value="Preventiva">Preventiva (Agendada)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Prioridade *</label>
                  <select
                    name="prioridade"
                    required
                    value={formData.prioridade}
                    onChange={handleInputChange}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Data da Solicitação *</label>
                <input
                  type="date"
                  name="data_solicitacao"
                  required
                  value={formData.data_solicitacao}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição do Problema / Observações *</label>
                <textarea
                  name="descricao"
                  rows="4"
                  required
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva o problema técnico ou a necessidade de manutenção..."
                ></textarea>
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
                  {isSubmitting ? "Enviando..." : "Confirmar Solicitação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Internal icons helper for stats (import mapping correction if needed)
function ClipboardList(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
