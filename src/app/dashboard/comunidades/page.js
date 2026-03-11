"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { MapPin, Home, AlertTriangle, Plus, X } from "lucide-react";

export default function GestaoComunidades() {
  const [comunidades, setComunidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    bairro: "",
    lider_comunitario: "",
    contato: "",
    nucleos_familiares: 0,
  });

  const fetchComunidades = () => {
    fetch("/api/comunidades")
      .then((res) => res.json())
      .then((data) => {
        setComunidades(data);
      })
      .catch((err) => {
        console.error("Failed to load comunidades", err);
      });
  };

  const fetchBairros = () => {
    fetch("/api/bairros")
      .then((res) => res.json())
      .then((data) => {
        setBairros(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load bairros", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComunidades();
    fetchBairros();
  }, []);

  const calculateRisk = (ocorrencias) => {
    const num = parseInt(ocorrencias) || 0;
    if (num === 0) return { label: "Baixo", class: styles.riskLow };
    if (num <= 3) return { label: "Médio", class: styles.riskMedium };
    return { label: "Alto", class: styles.riskHigh };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comunidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          nucleos_familiares: parseInt(formData.nucleos_familiares) || 0,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          nome: "",
          bairro: "",
          lider_comunitario: "",
          contato: "",
          nucleos_familiares: 0,
        });
        fetchComunidades(); // Reload data
      } else {
        alert("Erro ao salvar a comunidade. Verifique os dados.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Falha de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComunidades = comunidades.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lider_comunitario &&
        c.lider_comunitario.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalComunidades = comunidades.length;
  const totalFamilias = comunidades.reduce(
    (acc, curr) => acc + (parseInt(curr.nucleos_familiares) || 0),
    0,
  );
  const comOcorrencias = comunidades.filter((c) => c.ocorrencias > 0).length;

  if (loading) return <div>Carregando dados...</div>;

  return (
    <div className={styles.container}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total de Comunidades</span>
            <MapPin size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalComunidades}</div>
          <div className={styles.statSub}>cadastradas no sistema</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Núcleos Familiares</span>
            <Home size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {totalFamilias.toLocaleString("pt-BR")}
          </div>
          <div className={styles.statSub}>registrados nestes locais</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Com Ocorrências</span>
            <AlertTriangle size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{comOcorrencias}</div>
          <div className={styles.statSub}>requerem atenção</div>
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Comunidades</h2>
            <p className={styles.tableSub}>
              Gerencie todas as comunidades cadastradas
            </p>
          </div>
          <button
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            Adicionar Comunidade
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Buscar comunidades por nome ou bairro..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Comunidade</th>
                <th>Bairro</th>
                <th className={styles.textRight}>Núcleos Familiares</th>
                <th className={styles.textCenter}>Líder Comunitário</th>
                <th className={styles.textCenter}>Contato</th>
                <th className={styles.textCenter}>Ocorrências</th>
                <th className={styles.textCenter}>Risco</th>
              </tr>
            </thead>
            <tbody>
              {filteredComunidades.length > 0 ? (
                filteredComunidades.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.fontMedium}>{c.nome}</td>
                    <td className={styles.textMuted}>{c.bairro}</td>
                    <td className={styles.textRight}>
                      {c.nucleos_familiares.toLocaleString("pt-BR")}
                    </td>
                    <td className={styles.textCenter}>
                      {c.lider_comunitario || "-"}
                    </td>
                    <td className={styles.textCenter}>{c.contato || "-"}</td>
                    <td className={styles.textCenter}>
                      {c.ocorrencias || "-"}
                    </td>
                    <td className={styles.textCenter}>
                      <span
                        className={`${styles.riskBadge} ${calculateRisk(c.ocorrencias).class}`}
                      >
                        {calculateRisk(c.ocorrencias).label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className={styles.textCenter}
                    style={{ padding: "2rem" }}
                  >
                    Nenhuma comunidade encontrada com esse termo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Adicionar Comunidade</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome da Comunidade *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Vila Esperança"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bairro">Bairro Base *</label>
                <select
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Selecione um bairro...
                  </option>
                  {bairros.map((b) => (
                    <option key={b.id} value={b.nome}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lider_comunitario">Líder Comunitário</label>
                <input
                  type="text"
                  id="lider_comunitario"
                  name="lider_comunitario"
                  value={formData.lider_comunitario}
                  onChange={handleInputChange}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contato">Contato do Líder</label>
                <input
                  type="text"
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="Ex: (51) 99999-9999"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="nucleos_familiares">
                  Estimativa de Núcleos Familiares
                </label>
                <input
                  type="number"
                  id="nucleos_familiares"
                  name="nucleos_familiares"
                  value={formData.nucleos_familiares}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Comunidade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
