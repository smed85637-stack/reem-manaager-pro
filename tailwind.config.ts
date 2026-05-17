import type { Config } from "tailwindcss";
const config: Config = {content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],theme:{extend:{colors:{navy:"#071b3a",primary:"#1769e8"},boxShadow:{soft:"0 16px 40px rgba(31,74,125,.10)"}}},plugins:[]};
export default config;
