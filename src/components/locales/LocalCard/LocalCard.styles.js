const styles = {

  card: {

    background: "#ffffff",

    borderRadius: "16px",

    padding: "22px",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",

    border:
      "1px solid #e5e7eb",

    display: "flex",

    flexDirection: "column",

    gap: "18px",

  },


  header: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

  },


  title: {

    margin: 0,

    fontSize: "20px",

    fontWeight: "700",

    color: "#111827",

  },


  nombre: {

    margin:
      "6px 0 0 0",

    fontSize: "18px",

    fontWeight: "600",

    color: "#374151",

  },


  info: {

    display: "flex",

    flexDirection: "column",

    gap: "8px",

    color: "#4b5563",

    fontSize: "14px",

  },


  infoItem: {

    margin: 0,

  },


  dotacion: {

    background: "#f8fafc",

    border:
      "1px solid #e2e8f0",

    borderRadius: "12px",

    padding: "15px",

  },


  dotacionTitulo: {

    fontSize: "15px",

    fontWeight: "700",

    color: "#1f2937",

    marginBottom: "12px",

  },


  dotacionGrid: {

    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "12px",

  },


  dotacionItem: {

    background: "#ffffff",

    borderRadius: "10px",

    padding: "12px",

    textAlign: "center",

    border:
      "1px solid #e5e7eb",

  },


  dotacionLabel: {

    display: "block",

    fontSize: "12px",

    color: "#6b7280",

    marginBottom: "5px",

  },


  dotacionNumero: {

    display: "block",

    fontSize: "24px",

    fontWeight: "800",

    color: "#111827",

  },


  estado: {

    marginTop: "12px",

    padding: "10px",

    borderRadius: "8px",

    textAlign: "center",

    fontWeight: "700",

    fontSize: "14px",

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


  actions: {

    display: "flex",

    gap: "10px",

    marginTop: "4px",

  },


  edit: {

    flex: 1,

    border: "none",

    borderRadius: "8px",

    padding: "10px",

    cursor: "pointer",

    background: "#2563eb",

    color: "#ffffff",

    fontWeight: "600",

  },


  delete: {

    flex: 1,

    border: "none",

    borderRadius: "8px",

    padding: "10px",

    cursor: "pointer",

    background: "#dc2626",

    color: "#ffffff",

    fontWeight: "600",

  },

};


export default styles;