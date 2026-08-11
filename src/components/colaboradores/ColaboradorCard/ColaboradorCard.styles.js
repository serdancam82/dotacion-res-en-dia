const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    transition: "all .25s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  nombre: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
  },

  rol: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    margin: 0,
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "6px",
  },

  editButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  deleteButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default styles;