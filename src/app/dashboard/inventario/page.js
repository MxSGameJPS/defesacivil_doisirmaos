"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Package,
  Plus,
  Map,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Monitor,
  Droplet,
  Settings,
  Heart,
  X,
  PlusCircle,
  UploadCloud,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ClipboardList,
} from "lucide-react";

export default function GestaoInventario() {
  const [inventario, setInventario] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  // Modals
  // 0: Closed, 1: Choice, 2: Unitary Form, 4: Row Action Choice, 5: Exit Form
  const [modalStep, setModalStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    id_compra: "",
    link_siged: "",
    unidade_medida: "Unidade",
    categoria: "",
    subcategoria: "",
    descricao: "",
    quantidade: 0,
    valor_unitario: 0,
    localizacao: "",
    condicao: "Novo",
    num_tombo: "",
    data_aquisicao: new Date().toISOString().split("T")[0],
    tags: "",
  });

  const [exitData, setExitData] = useState({
    quantidade: 0,
    origem_destino: "Uso Interno",
    alerta_id: "",
    descricao: "",
    data_movimentacao: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const [invRes, alertRes] = await Promise.all([
        fetch("/api/inventario"),
        fetch("/api/alertas-humanitarios"),
      ]);
      const [invData, alertData] = await Promise.all([
        invRes.json(),
        alertRes.json(),
      ]);
      setInventario(invData);
      setAlertas(alertData);
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
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleExitChange = (e) => {
    const { name, value, type } = e.target;
    setExitData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchData();
        setModalStep(0);
        resetForms();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateExit = async (e) => {
    e.preventDefault();
    if (exitData.quantidade <= 0)
      return alert("Quantidade deve ser maior que zero");
    if (exitData.quantidade > activeItem.quantidade)
      return alert("Estoque insuficiente");

    setIsSubmitting(true);
    const payload = {
      item_id: activeItem.id,
      tipo: "Saida",
      origem_destino:
        exitData.origem_destino === "Alerta"
          ? exitData.alerta_id
          : "Uso Interno",
      quantidade: exitData.quantidade,
      descricao: exitData.descricao,
      data_movimentacao: exitData.data_movimentacao,
    };

    try {
      const res = await fetch("/api/inventario/movimentacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchData();
        setModalStep(0);
        resetForms();
      } else {
        const err = await res.json();
        alert(err.message || "Erro ao processar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForms = () => {
    setFormData({
      nome: "",
      id_compra: "",
      link_siged: "",
      unidade_medida: "Unidade",
      categoria: "",
      subcategoria: "",
      descricao: "",
      quantidade: 0,
      valor_unitario: 0,
      localizacao: "",
      condicao: "Novo",
      num_tombo: "",
      data_aquisicao: new Date().toISOString().split("T")[0],
      tags: "",
    });
    setExitData({
      quantidade: 0,
      origem_destino: "Uso Interno",
      alerta_id: "",
      descricao: "",
      data_movimentacao: new Date().toISOString().split("T")[0],
    });
    setActiveItem(null);
  };

  const openActionChoice = (item) => {
    setActiveItem(item);
    setModalStep(4);
  };

  const startQuickEntry = () => {
    setFormData({
      ...formData,
      nome: activeItem.nome,
      categoria: activeItem.categoria,
      subcategoria: activeItem.subcategoria,
      localizacao: activeItem.localizacao,
      condicao: activeItem.condicao,
      unidade_medida: activeItem.unidade_medida || "Unidade",
    });
    setModalStep(2);
  };

  const filtered = inventario.filter((item) => {
    const matchSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "Todas" || item.categoria === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getCondClass = (c) => {
    const cl = (c || "").toLowerCase();
    if (cl === "novo" || cl === "ótimo") return styles.condNovo;
    if (cl === "bom") return styles.condBom;
    if (cl === "regular") return styles.condSuf;
    return styles.condRuim;
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>Sincronizando depósitos...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Gestão de Inventário</h1>
        <p className={styles.subtitle}>
          Sistema completo de gerenciamento de equipamentos e materiais da
          Defesa Civil Dois Irmãos
        </p>
      </div>

      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setModalStep(1)}
            >
              <Plus size={18} /> Adicionar Item
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              <Map size={18} /> Ver Mapa
            </button>
          </div>
        </div>

        <div className={styles.actionCard}>
          <h2 className={styles.sectionTitle}>Visão Geral por Categoria</h2>
          <div className={styles.categoryGrid}>
            <div
              className={styles.categoryCard}
              onClick={() => setCategoryFilter("Mobiliário")}
            >
              <div
                className={styles.categoryIcon}
                style={{ background: "#dcfce7", color: "#10b981" }}
              >
                <Monitor size={20} />
              </div>
              <span className={styles.categoryName}>Projeto Escola</span>
            </div>
            <div
              className={styles.categoryCard}
              onClick={() => setCategoryFilter("Equipamentos")}
            >
              <div
                className={styles.categoryIcon}
                style={{ background: "#eff6ff", color: "#3b82f6" }}
              >
                <Droplet size={20} />
              </div>
              <span className={styles.categoryName}>Projeto Água Boa</span>
            </div>
            <div
              className={styles.categoryCard}
              onClick={() => setCategoryFilter("Equipamentos")}
            >
              <div
                className={styles.categoryIcon}
                style={{ background: "#f3e8ff", color: "#a855f7" }}
              >
                <Settings size={20} />
              </div>
              <span className={styles.categoryName}>Equipamentos</span>
            </div>
            <div
              className={styles.categoryCard}
              onClick={() => setCategoryFilter("Ajuda Humanitária")}
            >
              <div
                className={styles.categoryIcon}
                style={{ background: "#fee2e2", color: "#ef4444" }}
              >
                <Heart size={20} />
              </div>
              <span className={styles.categoryName}>Ajuda Humanitária</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.inventorySection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.sectionTitle}>Inventário Completo</h2>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {filtered.length} de {inventario.length} itens
          </span>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, categoria, subcategoria, tag ou localização..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Mobiliário">Mobiliário</option>
            <option value="Equipamentos">Equipamentos</option>
            <option value="Almoxarifado">Almoxarifado</option>
            <option value="Ajuda Humanitária">Ajuda Humanitária</option>
          </select>
          <button
            className={styles.btn}
            style={{ background: "#f1f5f9", color: "#475569" }}
          >
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>Quantidade</th>
                <th>Localização</th>
                <th>Condição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: "700" }}>{item.nome}</td>
                  <td>
                    <span
                      style={{
                        background: "#f1f5f9",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {item.categoria}
                    </span>
                  </td>
                  <td>{item.subcategoria}</td>
                  <td style={{ fontWeight: "700" }}>{item.quantidade}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {item.localizacao}
                  </td>
                  <td>
                    <span
                      className={`${styles.condBadge} ${getCondClass(item.condicao)}`}
                    >
                      {item.condicao}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openActionChoice(item)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                      }}
                    >
                      <ChevronRight size={18} style={{ color: "#94a3b8" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Choice Modal (Step 1) */}
      {modalStep === 1 && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalMedium}`}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className={styles.modalTitle}>
                  Adicionar Itens ao Inventário
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Escolha como deseja adicionar itens ao sistema de inventário
                </p>
              </div>
              <button
                onClick={() => setModalStep(0)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.choiceList}>
              <div
                className={styles.choiceItem}
                onClick={() => setModalStep(2)}
              >
                <div className={styles.choiceMain}>
                  <PlusCircle size={22} style={{ color: "var(--primary)" }} />{" "}
                  <span className={styles.choiceTitle}>Unitário</span>
                </div>
                <ChevronDown size={18} style={{ color: "#94a3b8" }} />
              </div>
              <div
                style={{
                  padding: "0 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <h5 style={{ fontSize: "0.85rem", fontWeight: "800" }}>
                  Cadastro Individual
                </h5>
                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Adicione um item por vez com informações detalhadas
                </p>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  style={{ justifyContent: "center" }}
                  onClick={() => setModalStep(2)}
                >
                  <Plus size={16} /> Adicionar Item Individual
                </button>
              </div>
              <div
                className={styles.choiceItem}
                onClick={() =>
                  alert(
                    "Sinal de importação em CSV/Planilha ainda em desenvolvimento...",
                  )
                }
              >
                <div className={styles.choiceMain}>
                  <UploadCloud size={22} style={{ color: "var(--primary)" }} />{" "}
                  <span className={styles.choiceTitle}>Múltiplos Itens</span>
                </div>
                <ChevronDown size={18} style={{ color: "#94a3b8" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Step 2) */}
      {modalStep === 2 && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalLarge}`}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className={styles.modalTitle}>Adicionar Novo Item</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Preencha os dados do novo item para adicionar ao inventário.
                </p>
              </div>
              <button
                onClick={() => setModalStep(activeItem ? 4 : 1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nome do Material *</label>
                  <input
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Kit Higiene Básica"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ID da Compra *</label>
                  <input
                    name="id_compra"
                    value={formData.id_compra}
                    onChange={handleInputChange}
                    placeholder="Ex: COMPRA-2025-001"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Link SIGED</label>
                  <input
                    name="link_siged"
                    value={formData.link_siged}
                    onChange={handleInputChange}
                    placeholder="https://siged.am.gov.br/..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Unidade de Medida Base *</label>
                  <select
                    name="unidade_medida"
                    value={formData.unidade_medida}
                    onChange={handleInputChange}
                  >
                    <option value="Unidade">Unidade</option>
                    <option value="Kit">Kit</option>
                    <option value="Caixa">Caixa</option>
                    <option value="Pacote">Pacote</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Categoria *</label>
                  <select
                    name="categoria"
                    required
                    value={formData.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Mobiliário">Mobiliário</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Almoxarifado">Almoxarifado</option>
                    <option value="Ajuda Humanitária">Ajuda Humanitária</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Subcategoria *</label>
                  <input
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleInputChange}
                    placeholder="Ex: Material de Escritório"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label>Descrição Detalhada *</label>
                  <textarea
                    name="descricao"
                    rows="3"
                    required
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva o material detalhadamente..."
                  ></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label>Quantidade *</label>
                  <input
                    type="number"
                    name="quantidade"
                    required
                    value={formData.quantidade}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Valor Unitário (R$)*</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_unitario"
                    value={formData.valor_unitario}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label>Localização *</label>
                  <input
                    name="localizacao"
                    required
                    value={formData.localizacao}
                    onChange={handleInputChange}
                    placeholder="Ex: Sede Principal - Andar 1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Condição Inicial *</label>
                  <select
                    name="condicao"
                    value={formData.condicao}
                    onChange={handleInputChange}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                    <option value="Ruim">Ruim</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Nº do Tombo (se houver)</label>
                  <input
                    name="num_tombo"
                    value={formData.num_tombo}
                    onChange={handleInputChange}
                    placeholder="TOMB-2025-001"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Data de Aquisição *</label>
                  <input
                    type="date"
                    name="data_aquisicao"
                    value={formData.data_aquisicao}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label>Tags (separadas por vírgula)</label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="higiene, emergência, doação"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btn}
                  style={{ background: "#f1f5f9", color: "#64748b" }}
                  onClick={() => {
                    setModalStep(activeItem ? 4 : 1);
                    setActiveItem(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  style={{ background: "#f1f5f9", color: "#475569" }}
                  onClick={handleSave}
                >
                  Salvar e Novo
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sincronizando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Row Action Choice (Step 4) */}
      {modalStep === 4 && activeItem && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalMedium}`}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className={styles.modalTitle}>Gerar Movimentação</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Selecione o tipo de ação para o item: <b>{activeItem.nome}</b>
                </p>
              </div>
              <button
                onClick={() => setModalStep(0)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.choiceList}>
              <div className={styles.choiceItem} onClick={startQuickEntry}>
                <div className={styles.choiceMain}>
                  <ArrowUpRight size={22} style={{ color: "#10b981" }} />
                  <div>
                    <span className={styles.choiceTitle}>
                      Lançar Nova Entrada
                    </span>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      Adicionar mais estoque deste item ao sistema
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "#94a3b8" }} />
              </div>
              <div
                className={styles.choiceItem}
                onClick={() => setModalStep(5)}
              >
                <div className={styles.choiceMain}>
                  <ArrowDownLeft size={22} style={{ color: "#ef4444" }} />
                  <div>
                    <span className={styles.choiceTitle}>Lançar Saída</span>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      Registrar entrega ou uso deste material
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "#94a3b8" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Form Modal (Step 5) */}
      {modalStep === 5 && activeItem && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalMedium}`}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className={styles.modalTitle}>Lançar Saída de Material</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Registrando saída de: {activeItem.nome} (Estoque:{" "}
                  {activeItem.quantidade})
                </p>
              </div>
              <button
                onClick={() => setModalStep(4)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExit}>
              <div
                className={styles.formGrid}
                style={{ gridTemplateColumns: "1fr" }}
              >
                <div className={styles.formGroup}>
                  <label>Destino da Saída *</label>
                  <select
                    name="origem_destino"
                    value={exitData.origem_destino}
                    onChange={handleExitChange}
                  >
                    <option value="Uso Interno">
                      Uso Interno da Defesa Civil
                    </option>
                    <option value="Alerta">Alerta Humanitário Ativo</option>
                  </select>
                </div>

                {exitData.origem_destino === "Alerta" && (
                  <div className={styles.formGroup}>
                    <label>Selecione o Alerta Humanitário *</label>
                    <select
                      name="alerta_id"
                      required
                      value={exitData.alerta_id}
                      onChange={handleExitChange}
                    >
                      <option value="">Selecione um alerta...</option>
                      {alertas
                        .filter((a) => a.status === "Ativo")
                        .map((a) => (
                          <option
                            key={a.id}
                            value={`${a.codigo} - ${a.titulo}`}
                          >
                            {a.codigo} - {a.titulo}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>
                    Quantidade Utilizada * (Máx: {activeItem.quantidade})
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    required
                    min="1"
                    max={activeItem.quantidade}
                    value={exitData.quantidade}
                    onChange={handleExitChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Data da Saída *</label>
                  <input
                    type="date"
                    name="data_movimentacao"
                    required
                    value={exitData.data_movimentacao}
                    onChange={handleExitChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição do Uso / Justificativa</label>
                  <textarea
                    name="descricao"
                    rows="3"
                    value={exitData.descricao}
                    onChange={handleExitChange}
                    placeholder="Ex: Entrega de cestas básicas na comunidade X para famílias afetadas."
                  ></textarea>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btn}
                  style={{ background: "#f1f5f9", color: "#64748b" }}
                  onClick={() => setModalStep(4)}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`${styles.btn}`}
                  style={{ background: "#ef4444", color: "white" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : "Confirmar Saída"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
