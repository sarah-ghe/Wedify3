export const weddingTheme = {
    colors: {
        primary: "#b8860b", // goldenrod
        accent: "#fbbf24", // amber-400
        text: {
            dark: "#3f2817", // stone-700
            light: "#a89968", // stone-500
            muted: "#d4cfc5", // stone-400
        },
        background: {
            light: "#fffdf9",
            overlay: "#f9e8e0",
        },
        border: "#e7e5e4", // stone-200
    },
    fonts: {
        serif: "'Georgia', 'Times New Roman', serif",
        sans: "system-ui, -apple-system, sans-serif",
    },
    spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
    },
} as const;
