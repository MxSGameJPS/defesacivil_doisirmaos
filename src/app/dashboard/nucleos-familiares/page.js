"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Users,
  Baby,
  UserRound,
  ShieldAlert,
  Plus,
  X,
  Search,
} from "lucide-react";

export default function NucleosFamiliares() {
  const [nucleos, setNucleos] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    responsavel: "",
    comunidade: "",
    bairro: "",
    membros: 1,
    criancas: 0,
    idosos: 0,
    pcd: 0,
    vulnerabilidade: "Baixa",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/nucleos-familiares").then((res) => res.json()),
      fetch("/api/comunidades").then((res) => res.json()),
      fetch("/api/bairros").then((res) => res.json()),
    ])
      .then(([nucleosData, comunidadesData, bairrosData]) => {
        setNucleos(nucleosData);
        setComunidades(comunidadesData);
        setBairros(bairrosData);
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
      const res = await fetch("/api/nucleos-familiares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setNucleos([data.nucleo, ...nucleos]);
        setIsModalOpen(false);
        setFormData({
          responsavel: "",
          comunidade: "",
          bairro: "",
          membros: 1,
          criancas: 0,
          idosos: 0,
          pcd: 0,
          vulnerabilidade: "Baixa",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVulnClass = (v) => {
    if (v === "Baixa") return styles.vulnBaixa;
    if (v === "Média") return styles.vulnMedia;
    if (v === "Alta") return styles.vulnAlta;
    return styles.vulnCritica;
  };

  const filtered = nucleos.filter(
    (n) =>
      n.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.comunidade.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    totalNucleos: nucleos.length,
    totalPessoas: nucleos.reduce((a, b) => a + (b.membros || 0), 0),
    totalCriancas: nucleos.reduce((a, b) => a + (b.criancas || 0), 0),
    totalCritico: nucleos.filter((n) => n.vulnerabilidade === "Crítica").length,
  };

  if (loading) return <div style={{ padding: "2rem" }}>Carregando...</div>;

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Núcleos Familiares</span>
            <Users size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalNucleos}</div>
          <div className={styles.statSub}>cadastrados</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Habitantes</span>
            <UserRound size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalPessoas}</div>
          <div className={styles.statSub}>pessoas assistidas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Crianças</span>
            <Baby size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalCriancas}</div>
          <div className={styles.statSub}>em áreas de risco</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Atenção Crítica</span>
            <ShieldAlert size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalCritico}</div>
          <div className={styles.statSub}>requerem intervenção</div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Núcleos Familiares</h2>
            <p className={styles.tableSub}>Gerencie os registros familiares</p>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Cadastrar Núcleo Familiar
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por código, responsável ou comunidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Responsável</th>
                <th>Comunidade</th>
                <th>Bairro</th>
                <th>Membros</th>
                <th>Crianças</th>
                <th>Idosos</th>
                <th>PCD</th>
                <th>Vulnerabilidade</th>
                <th>Recebeu Ajuda</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id}>
                  <td className={styles.fontMedium}>{n.codigo}</td>
                  <td className={styles.fontMedium}>{n.responsavel}</td>
                  <td>{n.comunidade}</td>
                  <td>{n.bairro}</td>
                  <td>{n.membros}</td>
                  <td>{n.criancas}</td>
                  <td>{n.idosos}</td>
                  <td>{n.pcd}</td>
                  <td>
                    <span
                      className={`${styles.vulnBadge} ${getVulnClass(n.vulnerabilidade)}`}
                    >
                      {n.vulnerabilidade}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.ajudaBadge} ${n.recebeu_ajuda ? styles.ajudaSim : styles.ajudaNao}`}
                    >
                      {n.recebeu_ajuda ? "Sim" : "Não"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Novo Cadastro Familiar</h3>
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
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Responsável Familiar *</label>
                  <input
                    name="responsavel"
                    required
                    value={formData.responsavel}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Bairro Base *</label>
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
                  <label>Comunidade *</label>
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
                  <label>Total de Membros</label>
                  <input
                    type="number"
                    name="membros"
                    value={formData.membros}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Crianças</label>
                  <input
                    type="number"
                    name="criancas"
                    value={formData.criancas}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Idosos</label>
                  <input
                    type="number"
                    name="idosos"
                    value={formData.idosos}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>PCD</label>
                  <input
                    type="number"
                    name="pcd"
                    value={formData.pcd}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Nível de Vulnerabilidade</label>
                  <select
                    name="vulnerabilidade"
                    value={formData.vulnerabilidade}
                    onChange={handleInputChange}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
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
                  {isSubmitting ? "Gravando..." : "Finalizar Cadastro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
