"use client";

import styles from "./page.module.css";
import {
  Info,
  Map,
  Users,
  Heart,
  ClipboardList,
  Bell,
  Archive,
  Wrench,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export default function InformacoesPage() {
  const modules = [
    {
      title: "Gestão de Bairros",
      desc: "Cadastro e gerenciamento de Bairros atendidos",
      icon: <Map size={20} />,
      color: "#eff6ff",
      iconColor: "#3b82f6",
    },
    {
      title: "Comunidades",
      desc: "Registro de comunidades e suas características",
      icon: <MapPin size={20} />,
      color: "#f0fdf4",
      iconColor: "#10b981",
    },
    {
      title: "Núcleos Familiares",
      desc: "Controle de famílias e suas necessidades",
      icon: <Users size={20} />,
      color: "#fbf1ff",
      iconColor: "#a855f7",
    },
    {
      title: "Ocorrências",
      desc: "Registro e acompanhamento de incidentes",
      icon: <ClipboardList size={20} />,
      color: "#fff7ed",
      iconColor: "#f97316",
    },
    {
      title: "Alertas Humanitários",
      desc: "Gerenciamento de situações de emergência",
      icon: <Heart size={20} />,
      color: "#fef2f2",
      iconColor: "#ef4444",
    },
    {
      title: "Gestão de Inventário",
      desc: "Controle completo de materiais e equipamentos",
      icon: <Archive size={20} />,
      color: "#f0f9ff",
      iconColor: "#0ea5e9",
    },
    {
      title: "Manutenimento",
      desc: "Gestão de manutenções preventivas e corretivas",
      icon: <Wrench size={20} />,
      color: "#fefce8",
      iconColor: "#ca8a04",
    },
  ];

  const systemResources = [
    "Cadastro e gerenciamento completo de inventário com múltiplas categorias",
    "Sistema de movimentação de itens vinculado a alertas humanitários",
    "Monitoramento dinâmico de risco por bairro e comunidade",
    "Registro detalhado de censo familiar e necessidades básicas",
    "Controle de patrimônio com números de tombo e localização",
    "Sistema de alertas com checklists de ajuda humanitária",
    "Gestão de chamados técnicos para manutenção de equipamentos",
    "Dashboard consolidado com indicadores em tempo real",
    "Interface responsiva e otimizada para uso operacional",
  ];

  return (
    <div className={styles.container}>
      {/* Header Info Card */}
      <div className={styles.card}>
        <div className={styles.headerCard}>
          <div className={styles.logoBox}>
            <Shield size={32} />
          </div>
          <div className={styles.appInfo}>
            <h2 className={styles.appName}>SISPDEC</h2>
            <p className={styles.appDesc}>
              Sistema de Proteção e Defesa Civil - Dois Irmãos
            </p>
          </div>
        </div>

        <div className={styles.versionRow}>
          <div className={styles.infoGroup}>
            <label>Versão</label>
            <span>1.0.0</span>
          </div>
          <div className={styles.infoGroup}>
            <label>Data de Lançamento</label>
            <span>Março de 2026</span>
          </div>
          <div className={styles.infoGroup} style={{ marginTop: "1.5rem" }}>
            <label>Desenvolvido por</label>
            <span style={{ color: "var(--primary)" }}>
              CDS - Coordenadoria de Defesa Civil
            </span>
          </div>
          <div className={styles.infoGroup} style={{ marginTop: "1.5rem" }}>
            <label>Tecnologias</label>
            <div className={styles.techBadges}>
              <div className={styles.techBadge}>Next.js</div>
              <div className={styles.techBadge}>JavaScript</div>
              <div className={styles.techBadge}>CSS Modules</div>
              <div className={styles.techBadge}>PostgreSQL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Card */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>
          <Layers size={22} color="var(--primary)" /> Módulos do Sistema
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#64748b",
            marginBottom: "1.5rem",
          }}
        >
          Funcionalidades disponíveis no SISPDEC:
        </p>

        <div className={styles.moduleGrid}>
          {modules.map((m, idx) => (
            <div key={idx} className={styles.moduleItem}>
              <div
                className={styles.moduleIcon}
                style={{ backgroundColor: m.color, color: m.iconColor }}
              >
                {m.icon}
              </div>
              <div className={styles.moduleText}>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info Card */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>
          <Phone size={22} color="var(--primary)" /> Informações de Contato
        </h3>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <MapPin className={styles.contactIcon} size={20} />
            <div>
              <span className={styles.contactLabel}>Endereço</span>
              <span className={styles.contactValue}>Dois Irmãos - RS</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <Phone className={styles.contactIcon} size={20} />
            <div>
              <span className={styles.contactLabel}>
                Telefone de Emergência
              </span>
              <span className={styles.contactValue}>199</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <Mail className={styles.contactIcon} size={20} />
            <div>
              <span className={styles.contactLabel}>E-mail</span>
              <span className={styles.contactValue}>
                defesacivil@doisirmaos.rs.gov.br
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Resources Card */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>
          <CheckCircle2 size={22} color="var(--primary)" /> Recursos do Sistema
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#64748b",
            marginBottom: "1.5rem",
          }}
        >
          Principais funcionalidades implementadas:
        </p>

        <div className={styles.resourceList}>
          {systemResources.map((res, idx) => (
            <div key={idx} className={styles.resourceItem}>
              <CheckCircle2 size={16} className={styles.checkIcon} />
              <span>{res}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerText}>
          © 2026 Defesa Civil Dois Irmãos. Todos os direitos reservados.
          <br />
          Desenvolvido para facilitar a gestão e coordenação de operações de
          defesa civil.
        </div>
      </footer>
    </div>
  );
}
