import { theme } from "../../styles/theme";

export const styles = {
  card: {
    background: theme.colors.surface,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.card,
    padding: 24,
    minWidth: 220,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: theme.transition,
    cursor: "default",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  value: {
    fontSize: 34,
    fontWeight: "700",
    color: theme.colors.text,
  },

  title: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },

  icon: {
    fontSize: 42,
  },
};