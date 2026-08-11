import { theme } from "../../../styles/theme";

export const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "12px",
    transition: "0.2s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },

  badge: {
    background: "#eee",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
  },

  item: {
    background: "#f7f7f7",
    padding: "8px",
    borderRadius: "8px",
  },

  label: {
    fontSize: "12px",
    opacity: 0.7,
  },

  value: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};