const styles = {

  topContent: {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 135px",
  gap: "14px",
  alignItems: "start",
  width: "100%",
},


  card: {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 5px 16px rgba(0,0,0,0.07)",
  border: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: 0,
},


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },


  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
  },


  nombre: {
    margin: "3px 0 0 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },


  mainContent: {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 170px",
  gap: "14px",
  alignItems: "start",
  width: "100%",
},


  info: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#4b5563",
    fontSize: "13px",
  },


  infoItem: {
    margin: 0,
  },


  dotacion: {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "7px",
  width: "135px",
  justifySelf: "end",
},

dotacionTitulo: {
  fontSize: "11px",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "5px",
  textAlign: "center",
},

dotacionVertical: {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
},

dotacionItem: {
  background: "#ffffff",
  borderRadius: "6px",
  padding: "4px 7px",
  textAlign: "center",
  border: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

dotacionLabel: {
  fontSize: "10px",
  color: "#6b7280",
},

dotacionNumero: {
  fontSize: "16px",
  fontWeight: "800",
  color: "#111827",
},

estado: {
  marginTop: "5px",
  padding: "5px 4px",
  borderRadius: "6px",
  textAlign: "center",
  fontWeight: "700",
  fontSize: "10px",
},


  estadoFaltante: {
    background: "#fef3c7",
    color: "#92400e",
  },


  estadoCompleto: {
    background: "#dcfce7",
    color: "#166534",
  },


  estadoExcedente: {
    background: "#fee2e2",
    color: "#991b1b",
  },


  colaboradoresSection: {
    borderTop:
      "1px solid #e5e7eb",
    paddingTop: "10px",
  },


  colaboradoresHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "none",
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "8px 10px",
    cursor: "pointer",
    color: "#374151",
    fontWeight: "700",
    fontSize: "13px",
  },


  colaboradoresLista: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    maxHeight: "180px",
    overflowY: "auto",
  },


  colaboradorItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fafb",
    border:
      "1px solid #e5e7eb",
    borderRadius: "7px",
    padding: "7px 9px",
    fontSize: "12px",
    color: "#1f2937",
  },


  colaboradorDetalle: {
    marginTop: "2px",
    fontSize: "11px",
    color: "#6b7280",
  },


  sinColaboradores: {
    padding: "10px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "12px",
  },


  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "2px",
  },


  edit: {
    flex: 1,
    border: "none",
    borderRadius: "7px",
    padding: "8px",
    cursor: "pointer",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "13px",
  },


  delete: {
    flex: 1,
    border: "none",
    borderRadius: "7px",
    padding: "8px",
    cursor: "pointer",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "13px",
  },

};


export default styles;

