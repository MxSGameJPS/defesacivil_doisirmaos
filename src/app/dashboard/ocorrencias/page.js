"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  X,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "",
    bairro: "",
    comunidade: "",
    data_ocorrencia: new Date().toISOString().split("T")[0],
    familias_afetadas: 0,
    gravidade: "Baixa",
    status: "Em andamento",
    descricao: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/ocorrencias").then((res) => res.json()),
      fetch("/api/bairros").then((res) => res.json()),
      fetch("/api/comunidades").then((res) => res.json()),
    ])
      .then(([ocorData, bairrosData, comData]) => {
        setOcorrencias(ocorData);
        setBairros(bairrosData);
        setComunidades(comData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data", err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ocorrencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setOcorrencias([data.ocorrencia, ...ocorrencias]);
        setIsModalOpen(false);
        setFormData({
          tipo: "",
          bairro: "",
          comunidade: "",
          data_ocorrencia: new Date().toISOString().split("T")[0],
          familias_afetadas: 0,
          gravidade: "Baixa",
          status: "Em andamento",
          descricao: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGravClass = (g) => {
    const gl = g.toLowerCase();
    if (gl === "baixa") return styles.gravBaixa;
    if (gl === "média" || gl === "media") return styles.gravMedia;
    if (gl === "alta") return styles.gravAlta;
    return styles.gravCritica;
  };

  const filtered = ocorrencias.filter(
    (o) =>
      o.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.comunidade.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: ocorrencias.length,
    emAndamento: ocorrencias.filter((o) => o.status === "Em andamento").length,
    resolvido: ocorrencias.filter((o) => o.status === "Resolvido").length,
    totalFamilias: ocorrencias.reduce(
      (a, b) => a + (b.familias_afetadas || 0),
      0,
    ),
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>Carregando ocorrências...</div>;

  return (
    <div className={styles.container}>
      {/* Dashboard Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total de Ocorrências</span>
            <AlertTriangle size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statSub}>registradas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Ocorrências Ativas</span>
            <Clock size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.emAndamento}</div>
          <div className={styles.statSub}>em andamento</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Ocorrências Resolvidas</span>
            <CheckCircle2 size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.resolvido}</div>
          <div className={styles.statSub}>concluídas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Famílias Afetadas</span>
            <Users size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalFamilias}</div>
          <div className={styles.statSub}>em acompanhamento</div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Ocorrências - Dois Irmãos/RS</h2>
            <p className={styles.tableSub}>
              Registre e acompanhe todos os eventos críticos
            </p>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Registrar Ocorrência
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por código, tipo, bairro ou comunidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Bairro</th>
                <th>Comunidade</th>
                <th>Data</th>
                <th style={{ textAlign: "center" }}>Famílias Afetadas</th>
                <th>Gravidade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className={styles.fontMedium}>{o.codigo}</td>
                  <td className={styles.fontMedium}>{o.tipo}</td>
                  <td>{o.bairro}</td>
                  <td>{o.comunidade}</td>
                  <td>
                    {new Date(o.data_ocorrencia).toLocaleDateString("pt-BR")}
                  </td>
                  <td style={{ textAlign: "center" }}>{o.familias_afetadas}</td>
                  <td>
                    <span
                      className={`${styles.gravBadge} ${getGravClass(o.gravidade)}`}
                    >
                      {o.gravidade}
                    </span>
                  </td>
                  <td>
                    <div
                      className={`${styles.statusBadge} ${o.status === "Resolvido" ? styles.statusResolvido : styles.statusAndamento}`}
                    >
                      {o.status === "Resolvido" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {o.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registry */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Nova Ocorrência</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>
                    <Layers size={14} /> Tipo de Evento *
                  </label>
                  <select
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione o tipo...</option>
                    <option value="Alagamento">Alagamento</option>
                    <option value="Deslizamento">Deslizamento</option>
                    <option value="Falta de Água">Falta de Água</option>
                    <option value="Queda de Árvore">Queda de Árvore</option>
                    <option value="Incêndio">Incêndio</option>
                    <option value="Interdição de Via">Interdição de Via</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <Calendar size={14} /> Data do Evento *
                  </label>
                  <input
                    type="date"
                    name="data_ocorrencia"
                    required
                    value={formData.data_ocorrencia}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <MapPin size={14} /> Bairro *
                  </label>
                  <select
                    name="bairro"
                    required
                    value={formData.bairro}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    {bairros.map((b) => (
                      <option key={b.id} value={b.nome}>
                        {b.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <MapPin size={14} /> Comunidade *
                  </label>
                  <select
                    name="comunidade"
                    required
                    value={formData.comunidade}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    {comunidades
                      .filter((c) => c.bairro === formData.bairro)
                      .map((c) => (
                        <option key={c.id} value={c.nome}>
                          {c.nome}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <Users size={14} /> Famílias Afetadas
                  </label>
                  <input
                    type="number"
                    name="familias_afetadas"
                    value={formData.familias_afetadas}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nível de Gravidade</label>
                  <select
                    name="gravidade"
                    value={formData.gravidade}
                    onChange={handleInputChange}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label>Descrição Detalhada</label>
                  <textarea
                    name="descricao"
                    rows="3"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva os danos e ações necessárias..."
                  ></textarea>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.saveButton}
                >
                  {isSubmitting ? "Processando..." : "Confirmar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
