import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

// Default config (can be overridden by pages)
// https://vike.dev/config
export default {
  title: "Otaku",
  description: "AI - trading agent",
  extends: vikeReact,
} satisfies Config;
