"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  MapPin,
  Users,
  Home,
  AlertTriangle,
  FileText,
  Edit2,
  Check,
  X,
} from "lucide-react";

export default function GestaoBairros() {
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [populacaoOficial, setPopulacaoOficial] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Fetch system data
    fetch("/api/bairros")
      .then((res) => res.json())
      .then((data) => {
        setBairros(data);
        setLoading(false);
      });

    // Fetch official population from IBGE via their public API (IBGE Censo)
    fetch(
      "https://servicodados.ibge.gov.br/api/v3/agregados/9514/periodos/2022/variaveis/93?localidades=N6[4306403]",
    )
      .then((res) => res.json())
      .then((data) => {
        try {
          // Navigating IBGE payload to get the true value
          const resultParams = data[0].resultados[0].series[0].serie["2022"];
          if (resultParams) {
            setPopulacaoOficial(parseInt(resultParams, 10));
          }
        } catch (e) {
          console.error("Erro ao ler dados do IBGE", e);
        }
      })
      .catch((err) => console.error("Falha ao buscar IBGE", err));
  }, []);

  const calculateRisk = (ocorrencias) => {
    const num = parseInt(ocorrencias) || 0;
    if (num === 0) return { label: "Baixo", class: styles.riskLow };
    if (num <= 3) return { label: "Médio", class: styles.riskMedium };
    return { label: "Alto", class: styles.riskHigh };
  };

  const handleEditClick = (bairro) => {
    setEditingId(bairro.id);
    setEditValue(bairro.area_km2.toString());
  };

  const handleSaveArea = async (id) => {
    try {
      const response = await fetch(`/api/bairros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area_km2: parseFloat(editValue) }),
      });
      if (response.ok) {
        setBairros(
          bairros.map((b) =>
            b.id === id ? { ...b, area_km2: parseFloat(editValue) } : b,
          ),
        );
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBairros = bairros.filter(
    (bairro) =>
      bairro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bairro.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalBairros = bairros.length;
  // Fallback to local sum if IBGE data wasn't successfully recovered
  const localPopulacao = bairros.reduce(
    (acc, curr) => acc + (parseInt(curr.populacao) || 0),
    0,
  );
  const totalPopulacaoDisplay = populacaoOficial || localPopulacao;

  const totalFamilias = bairros.reduce(
    (acc, curr) => acc + (parseInt(curr.nucleos_familiares) || 0),
    0,
  );
  const totalOcorrencias = bairros.reduce(
    (acc, curr) => acc + (parseInt(curr.ocorrencias) || 0),
    0,
  );
  const totalAlertas = bairros.reduce(
    (acc, curr) => acc + (parseInt(curr.alertas) || 0),
    0,
  );

  if (loading) return <div>Carregando dados...</div>;

  return (
    <div className={styles.container}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total de Bairros</span>
            <MapPin size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalBairros}</div>
          <div className={styles.statSub}>em Dois Irmãos/RS</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>População Total</span>
            <Users size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {totalPopulacaoDisplay.toLocaleString("pt-BR")}
          </div>
          <div className={styles.statSub}>habitantes</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Núcleos Familiares</span>
            <Home size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {totalFamilias.toLocaleString("pt-BR")}
          </div>
          <div className={styles.statSub}>cadastrados</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Ocorrências Ativas</span>
            <AlertTriangle size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalOcorrencias}</div>
          <div className={styles.statSub}>requerem atenção</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Alertas Ativos</span>
            <FileText size={20} className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalAlertas}</div>
          <div className={styles.statSub}>em andamento</div>
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>
              Gestão de Bairros - Dois Irmãos/RS
            </h2>
            <p className={styles.tableSub}>
              Gerencie todos os bairros do município
            </p>
          </div>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Buscar bairros..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bairro</th>
                <th>Descrição</th>
                <th className={styles.textRight}>Área (km²)</th>
                <th className={styles.textRight}>Núcleos Familiares</th>
                <th className={styles.textCenter}>Ocorrências</th>
                <th className={styles.textCenter}>Alertas</th>
                <th className={styles.textCenter}>Nível de Risco</th>
              </tr>
            </thead>
            <tbody>
              {filteredBairros.length > 0 ? (
                filteredBairros.map((bairro) => (
                  <tr key={bairro.id}>
                    <td className={styles.fontMedium}>{bairro.nome}</td>
                    <td className={styles.textMuted}>{bairro.descricao}</td>
                    <td className={styles.textRight}>
                      {editingId === bairro.id ? (
                        <div className={styles.areaContainer}>
                          <input
                            type="number"
                            step="0.01"
                            className={styles.areaInput}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <button
                            className={styles.saveBtn}
                            onClick={() => handleSaveArea(bairro.id)}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className={styles.editAreaBtn}
                            onClick={() => setEditingId(null)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.areaContainer}>
                          <span>{bairro.area_km2}</span>
                          <button
                            className={styles.editAreaBtn}
                            onClick={() => handleEditClick(bairro)}
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      {bairro.nucleos_familiares.toLocaleString("pt-BR")}
                    </td>
                    <td className={styles.textCenter}>
                      {bairro.ocorrencias || "-"}
                    </td>
                    <td className={styles.textCenter}>
                      {bairro.alertas > 0 ? (
                        <span className={styles.alertBadge}>
                          {bairro.alertas}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={styles.textCenter}>
                      <span
                        className={`${styles.riskBadge} ${calculateRisk(bairro.ocorrencias).class}`}
                      >
                        {calculateRisk(bairro.ocorrencias).label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className={styles.textCenter}
                    style={{ padding: "2rem" }}
                  >
                    Nenhum bairro encontrado com esse termo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
