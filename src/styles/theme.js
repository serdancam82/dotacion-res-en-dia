/*
==========================================
SC Gestión Comercial V2

theme.js

Responsabilidad:
Tema visual único de toda la aplicación.

- Colores
- Tipografías
- Espaciados
- Bordes
- Sombras
- Transiciones

==========================================
*/

export const theme = {
  colors: {
    primary: "#1565C0",
    primaryDark: "#0D47A1",
    secondary: "#2E7D32",
    danger: "#D32F2F",
    warning: "#ED6C02",
    success: "#2E7D32",

    background: "#F4F7FB",
    surface: "#FFFFFF",

    text: "#1F2937",
    textSecondary: "#6B7280",

    border: "#E5E7EB",

    sidebar: "#0F172A",
    sidebarHover: "#1E293B",
    sidebarActive: "#2563EB",
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },

  shadow: {
    card: "0 6px 18px rgba(0,0,0,.08)",
    menu: "0 3px 12px rgba(0,0,0,.12)",
  },

  font: {
    family: "'Segoe UI', sans-serif",
    title: 30,
    subtitle: 20,
    body: 15,
    small: 13,
  },

  transition: "all .25s ease",
};