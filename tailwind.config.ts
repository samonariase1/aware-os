import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Include root files if not using src directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mappings
        background: '#050505', // Deep Void
        surface: '#121418',    // Neural Gray
        primary: '#00E0FF',    // Oxygen Teal
        warning: '#F59E0B',    // Drift Amber
        text: '#F1F5F9',       // Pure Signal
        
        // Specific named mappings (optional usage)
        'deep-void': '#050505',
        'neural-gray': '#121418',
        'oxygen-teal': '#00E0FF',
        'drift-amber': '#F59E0B',
        'pure-signal': '#F1F5F9',
      },
      // extending background color to standard utilities
      backgroundColor: {
        'app-bg': '#050505',
        'panel-bg': '#121418',
      },
      // extending text color to standard utilities
      textColor: {
        'app-text': '#F1F5F9',
      }
    },
  },
  plugins: [],
};
export default config;