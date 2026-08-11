/*
==========================================
SC Gestión Comercial V2

Sidebar.styles.js
==========================================
*/

import { theme } from "../../../styles/theme";

export const styles = {
  sidebar: {
    width: 270,
    height: "100vh",
    background: theme.colors.sidebar,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 20,
    boxSizing: "border-box",
  },

  logo: {
    marginBottom: 35,
  },

  logoTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },

  logoSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 5,
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  button: {
    background: "transparent",
    color: "#fff",
    border: "none",
    borderRadius: theme.radius.md,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    fontSize: 15,
    transition: theme.transition,
  },

  buttonActive: {
    background: theme.colors.sidebarActive,
  },

  footer: {
    borderTop: "1px solid rgba(255,255,255,.15)",
    paddingTop: 20,
  },

  userName: {
    fontWeight: "600",
    fontSize: 15,
  },

  userEmail: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 4,
  },
};