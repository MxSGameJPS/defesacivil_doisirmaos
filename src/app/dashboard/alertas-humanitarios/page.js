"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Bell,
  AlertOctagon,
  Users,
  UserRound,
  Plus,
  X,
  MapPin,
  Calendar,
  Baby,
  Heart,
  PackageSearch,
  LayoutDashboard,
  ClipboardList,
  Search,
} from "lucide-react";

export default function AlertasHumanitarios() {
  const [alertas, setAlertas] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AJUDA_OPCOES = [
    "Cesta Básica",
    "Kit de higiene",
    "Colchões",
    "Cobertores",
    "Roupas Infantis",
    "Roupas Masculina Adulto",
    "Roupas Femininas Adulto",
    "Atendimento Médico Imédiato",
    "Agua Potável",
    "Kit Primeiro socorros",
    "Repelente",
    "Material de Limpeza",
    "Lona Plástica",
    "Luvas",
    "Mascáras",
  ];

  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    bairro: "",
    comunidade: "",
    data_inicio: new Date().toISOString().split("T")[0],
    familias_afetadas: 0,
    numero_pessoas: 0,
    criancas_10: 0,
    criancas_13: 0,
    adolescentes_18: 0,
    idosos: 0,
    gestantes: 0,
    gravidade: "Média",
    status: "Ativo",
    descricao: "",
    ajuda_checks: [],
    outro_item: "",
  });

  const fetchData = async () => {
    try {
      const [alertRes, bairrosRes, comRes] = await Promise.all([
        fetch("/api/alertas-humanitarios"),
        fetch("/api/bairros"),
        fetch("/api/comunidades"),
      ]);
      const [alertData, bairrosData, comData] = await Promise.all([
        alertRes.json(),
        bairrosRes.json(),
        comRes.json(),
      ]);
      setAlertas(alertData);
      setBairros(bairrosData);
      setComunidades(comData);
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
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prev) => {
      const checks = [...prev.ajuda_checks];
      const idx = checks.indexOf(option);
      if (idx > -1) checks.splice(idx, 1);
      else checks.push(option);
      return { ...prev, ajuda_checks: checks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Process form for API
    const payload = {
      ...formData,
      ajuda_necessaria: formData.ajuda_checks.join(", "),
    };

    try {
      const res = await fetch("/api/alertas-humanitarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchData();
        setIsModalOpen(false);
        setFormData({
          titulo: "",
          tipo: "",
          bairro: "",
          comunidade: "",
          data_inicio: new Date().toISOString().split("T")[0],
          familias_afetadas: 0,
          numero_pessoas: 0,
          criancas_10: 0,
          criancas_13: 0,
          adolescentes_18: 0,
          idosos: 0,
          gestantes: 0,
          gravidade: "Média",
          status: "Ativo",
          descricao: "",
          ajuda_checks: [],
          outro_item: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: alertas.length,
    ativos: alertas.filter((a) => a.status === "Ativo").length,
    familias: alertas.reduce((a, b) => a + (b.familias_afetadas || 0), 0),
    pessoas: alertas.reduce((a, b) => a + (b.numero_pessoas || 0), 0),
  };

  const filtered = alertas.filter(
    (a) =>
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div style={{ padding: "2rem" }}>Sincronizando banco de alertas...</div>
    );

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Alertas Totais</span>
            <Bell size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div
          className={styles.statCard}
          style={{ borderLeft: "4px solid #ef4444" }}
        >
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Alertas Ativos</span>
            <AlertOctagon size={18} style={{ color: "#ef4444" }} />
          </div>
          <div className={styles.statValue}>{stats.ativos}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Famílias Afetadas</span>
            <Users size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.familias}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Pessoas Afetadas</span>
            <UserRound size={18} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.pessoas}</div>
        </div>
      </div>

      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.title}>Alerta Humanitário</h2>
          <p className={styles.subtitle}>
            Gerencie situações de emergência e necessidade humanitária
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} /> Criar Alerta
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por código, título ou localização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.searchIconWrapper}>
          <Search size={20} className={styles.searchIcon} />
        </div>
      </div>

      <div className={styles.feed}>
        {filtered.map((a) => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.codigo}>{a.codigo}</span>
              <span className={`${styles.badge} ${styles.typeBadge}`}>
                {a.tipo}
              </span>
              <span className={`${styles.badge} ${styles.gravBadge}`}>
                {a.gravidade}
              </span>
              <span
                className={`${styles.badge} ${a.status === "Ativo" ? styles.statusBadge : styles.statusFinal}`}
              >
                {a.status}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{a.titulo}</h3>
            <div className={styles.cardMeta}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <MapPin size={16} /> {a.bairro} - {a.comunidade}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Calendar size={16} />{" "}
                {new Date(a.data_inicio).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <p className={styles.cardDesc}>{a.descricao}</p>

            <div className={styles.impactGrid}>
              <div className={styles.impactItem}>
                <Users size={20} style={{ color: "#64748b" }} />
                <div>
                  <span className={styles.impactLabel}>Famílias</span>
                  <span className={styles.impactValue}>
                    {a.familias_afetadas}
                  </span>
                </div>
              </div>
              <div className={styles.impactItem}>
                <UserRound size={20} style={{ color: "#64748b" }} />
                <div>
                  <span className={styles.impactLabel}>Pessoas</span>
                  <span className={styles.impactValue}>{a.numero_pessoas}</span>
                </div>
              </div>
              <div className={styles.impactItem}>
                <Baby size={20} style={{ color: "#64748b" }} />
                <div>
                  <span className={styles.impactLabel}>Cens. Infantil</span>
                  <span className={styles.impactValue}>
                    {a.criancas_10 + a.criancas_13}
                  </span>
                </div>
              </div>
              <div className={styles.impactItem}>
                <Heart size={20} style={{ color: "#ef4444" }} />
                <div>
                  <span className={styles.impactLabel}>Gestantes</span>
                  <span className={styles.impactValue}>{a.gestantes}</span>
                </div>
              </div>
            </div>

            <div className={styles.needsSection}>
              <div className={styles.needsTitle}>Ajuda Necessária:</div>
              <div className={styles.needsTags}>
                {(a.ajuda_necessaria || "").split(",").map((tag, i) =>
                  tag ? (
                    <span key={i} className={styles.tag}>
                      {tag.trim()}
                    </span>
                  ) : null,
                )}
                {a.outro_item && (
                  <span
                    className={styles.tag}
                    style={{ background: "#fef2f2" }}
                  >
                    OUTROS: {a.outro_item}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REFACTORED MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Novo Alerta Humanitário</h3>
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
              {/* Part 1: General Info */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <LayoutDashboard size={16} /> Dados do Incidente
                </h4>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label>Título do Alerta / Nome do Evento *</label>
                    <input
                      name="titulo"
                      required
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Ex: Alagamento com famílias desabrigadas"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de Emergência *</label>
                    <select
                      name="tipo"
                      required
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="">Selecione...</option>
                      <option value="Inundação">Inundação / Alagamento</option>
                      <option value="Deslizamento">
                        Deslizamento de Terra
                      </option>
                      <option value="Incêndio">Incêndio</option>
                      <option value="Seca">Seca / Falta de Água</option>
                      <option value="Epidemia">Epidemia / Surto</option>
                      <option value="Vendaval">Vendaval / Destelhamento</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Bairro *</label>
                    <select
                      name="bairro"
                      required
                      value={formData.bairro}
                      onChange={handleInputChange}
                      className={styles.select}
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
                      className={styles.select}
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
                    <label>Data de Início *</label>
                    <input
                      type="date"
                      name="data_inicio"
                      required
                      value={formData.data_inicio}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nível de Gravidade</label>
                    <select
                      name="gravidade"
                      value={formData.gravidade}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Part 2: Human Census */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <UserRound size={16} /> Censo da População Afetada
                </h4>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Quant. de Famílias</label>
                    <input
                      type="number"
                      name="familias_afetadas"
                      value={formData.familias_afetadas}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Total de Pessoas</label>
                    <input
                      type="number"
                      name="numero_pessoas"
                      value={formData.numero_pessoas}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Gestantes</label>
                    <input
                      type="number"
                      name="gestantes"
                      value={formData.gestantes}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Crianças (até 10 anos)</label>
                    <input
                      type="number"
                      name="criancas_10"
                      value={formData.criancas_10}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Crianças (até 13 anos)</label>
                    <input
                      type="number"
                      name="criancas_13"
                      value={formData.criancas_13}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Adolescentes (até 18)</label>
                    <input
                      type="number"
                      name="adolescentes_18"
                      value={formData.adolescentes_18}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Idosos (+60)</label>
                    <input
                      type="number"
                      name="idosos"
                      value={formData.idosos}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Part 3: Resource needs (Checkboxes) */}
              <div className={styles.formSection}>
                <h4 className={styles.sectionTitle}>
                  <PackageSearch size={16} /> Ajuda Humanitária Necessária
                </h4>
                <div className={styles.checkboxGrid}>
                  {AJUDA_OPCOES.map((option) => (
                    <label key={option} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={formData.ajuda_checks.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <div
                  className={styles.formGroup}
                  style={{ marginTop: "1.2rem" }}
                >
                  <label>Outros (descreva):</label>
                  <input
                    name="outro_item"
                    value={formData.outro_item}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Especifique outros itens necessários..."
                  />
                </div>
              </div>

              <div
                className={`${styles.formGroup} ${styles.full}`}
                style={{ marginBottom: "2rem" }}
              >
                <label>
                  <ClipboardList size={14} /> Observações Adicionais
                </label>
                <textarea
                  name="descricao"
                  rows="3"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Descreva os detalhes da situação crítica..."
                ></textarea>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.saveBtn}
                >
                  {isSubmitting ? "Sincronizando..." : "Publicar Alerta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
