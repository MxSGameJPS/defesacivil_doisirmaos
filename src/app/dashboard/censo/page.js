"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Users,
  MapPin,
  Activity,
  Map,
  TrendingUp,
  Briefcase,
  Home,
} from "lucide-react";

export default function CensoIBGE() {
  const [data, setData] = useState({
    populacao: null,
    area: 65.15, // from IBGE static
    densidade: 471.4, // from IBGE static
    idh: 0.811, // from IBGE static
    pibPerCapita: 64791.9, // from IBGE static
    loading: true,
  });

  const [piramide, setPiramide] = useState({
    homens: 14893,
    mulheres: 15816,
  });

  useEffect(() => {
    // Busca população real Time do IBGE
    const fetchIbge = async () => {
      try {
        const resPop = await fetch(
          "https://servicodados.ibge.gov.br/api/v3/agregados/9514/periodos/2022/variaveis/93?localidades=N6[4306403]",
        );
        const jsonPop = await resPop.json();
        const populacaoCenso = parseInt(
          jsonPop[0].resultados[0].series[0].serie["2022"],
          10,
        );

        setData((prev) => ({
          ...prev,
          populacao: populacaoCenso,
          loading: false,
        }));
      } catch (e) {
        console.error("Erro ao buscar dados IBGE", e);
        // Fallback in case of error
        setData((prev) => ({
          ...prev,
          populacao: 30709,
          loading: false,
        }));
      }
    };

    fetchIbge();
  }, []);

  if (data.loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Conectando à API do IBGE...</p>
      </div>
    );
  }

  const femPercent = ((piramide.mulheres / data.populacao) * 100).toFixed(1);
  const mascPercent = ((piramide.homens / data.populacao) * 100).toFixed(1);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Censo Demográfico (IBGE)</h1>
          <p className={styles.subtitle}>
            Informações oficiais do último censo referentes ao município de Dois
            Irmãos/RS
          </p>
        </div>
        <button className={styles.updateButton}>Sincronizar Dados</button>
      </header>

      <div className={styles.grid}>
        {/* Main Stats */}
        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{
              background: "rgba(41, 77, 153, 0.1)",
              color: "var(--primary)",
            }}
          >
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>População Residente</span>
            <span className={styles.statValue}>
              {data.populacao.toLocaleString("pt-BR")}
            </span>
            <span className={styles.statDesc}>Censo 2022, IBGE</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{
              background: "rgba(231, 76, 60, 0.1)",
              color: "var(--danger)",
            }}
          >
            <Map size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Área Territorial</span>
            <span className={styles.statValue}>{data.area} km²</span>
            <span className={styles.statDesc}>Registrado em 2022</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{
              background: "rgba(46, 204, 113, 0.1)",
              color: "var(--success)",
            }}
          >
            <Activity size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Densidade Demográfica</span>
            <span className={styles.statValue}>{data.densidade}</span>
            <span className={styles.statDesc}>habitantes por km²</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIconWrapper}
            style={{
              background: "rgba(243, 156, 18, 0.1)",
              color: "var(--warning)",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Índice de Desenv. Humano</span>
            <span className={styles.statValue}>{data.idh}</span>
            <span className={styles.statDesc}>IDHM, IBGE</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        {/* Demographics Card */}
        <div className={styles.detailsCard}>
          <h3 className={styles.cardTitle}>Composição por Sexo</h3>

          <div className={styles.chartContainer}>
            <div className={styles.genderRow}>
              <div className={styles.genderLabel}>
                <span>Mulheres</span>
                <span className={styles.genderValue}>
                  {piramide.mulheres.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: femPercent + "%",
                    backgroundColor: "#e84393",
                  }}
                ></div>
              </div>
              <span className={styles.percentage}>{femPercent}%</span>
            </div>

            <div className={styles.genderRow}>
              <div className={styles.genderLabel}>
                <span>Homens</span>
                <span className={styles.genderValue}>
                  {piramide.homens.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: mascPercent + "%",
                    backgroundColor: "#0984e3",
                  }}
                ></div>
              </div>
              <span className={styles.percentage}>{mascPercent}%</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsCard}>
          <h3 className={styles.cardTitle}>Dados Sócio-Econômicos</h3>
          <ul className={styles.listDetails}>
            <li>
              <div className={styles.listIcon}>
                <Briefcase size={18} />
              </div>
              <div className={styles.listText}>
                <strong>PIB per Capita</strong>
                <span>
                  R$ {data.pibPerCapita.toLocaleString("pt-BR")} (2021)
                </span>
              </div>
            </li>
            <li>
              <div className={styles.listIcon}>
                <MapPin size={18} />
              </div>
              <div className={styles.listText}>
                <strong>Gentílico</strong>
                <span>Dois-irmonense</span>
              </div>
            </li>
            <li>
              <div className={styles.listIcon}>
                <Home size={18} />
              </div>
              <div className={styles.listText}>
                <strong>Bioma</strong>
                <span>Mata Atlântica</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
