"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MoreHorizontal,
  Search,
  Filter,
  User,
  Phone,
  ArrowRight
} from "lucide-react";

export default function ChamadosAppPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/chamados");
      const data = await res.json();
      setChamados(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = chamados.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo_ocorrencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter(c => c.status === 'Pendente').length,
    emAtendimento: chamados.filter(c => c.status === 'Em Atendimento').length,
    concluidos: chamados.filter(c => c.status === 'Concluído').length
  };

  const getStatusClass = (s) => {
    if (s === 'Pendente') return styles.statusPendente;
    if (s === 'Em Atendimento') return styles.statusAtendimento;
    if (s === 'Concluído') return styles.statusConcluido;
    return '';
  };

  const getPrioClass = (p) => {
    if (p === 'Alta') return styles.prioAlta;
    if (p === 'Urgente') return styles.prioUrgente;
    return '';
  };

  if (loading) return <div style={{padding: "2rem"}}>Sincronizando chamados do aplicativo...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.title}>Chamados do Aplicativo</h1>
          <p className={styles.subtitle}>Pedidos de ajuda enviados pela comunidade via Mobile App</p>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Recebidos</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard} style={{borderLeft: '4px solid #ef4444'}}>
          <span className={styles.statLabel}>Pendentes</span>
          <span className={styles.statValue}>{stats.pendentes}</span>
        </div>
        <div className={styles.statCard} style={{borderLeft: '4px solid #ca8a04'}}>
          <span className={styles.statLabel}>Em Atendimento</span>
          <span className={styles.statValue}>{stats.emAtendimento}</span>
        </div>
        <div className={styles.statCard} style={{borderLeft: '4px solid #10b981'}}>
          <span className={styles.statLabel}>Concluídos</span>
          <span className={styles.statValue}>{stats.concluidos}</span>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div style={{position: 'relative', marginBottom: '1.5rem'}}>
          <Search style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nome, bairro ou tipo de ocorrência..." 
            style={{width: '100%', padding: '0.8rem 0.8rem 0.8rem 3rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem'}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Solicitante</th>
                <th>Bairro / Endereço</th>
                <th>Ocorrência</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{fontSize: '0.75rem', fontWeight: '700'}}>
                    {new Date(c.data_solicitacao).toLocaleDateString()}<br/>
                    {new Date(c.data_solicitacao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontWeight: '700'}}>{c.nome}</span>
                      <span style={{fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <Phone size={12} /> {c.telefone}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontWeight: '700'}}>{c.bairro}</span>
                      <span style={{fontSize: '0.75rem', color: '#64748b'}}>{c.endereco}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{fontWeight: '800', color: '#1e293b'}}>{c.tipo_ocorrencia}</span>
                  </td>
                  <td>
                    <span className={`${styles.prioBadge} ${getPrioClass(c.prioridade)}`}>
                      {c.prioridade}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn}>
                      Atender <ArrowRight size={14} style={{marginLeft: '4px'}} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
                    Nenhum chamado encontrado com estes filtros.
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
