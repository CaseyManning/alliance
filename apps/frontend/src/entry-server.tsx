import { renderToString } from "react-dom/server";
import App from "./App";

export function render(_url: string) {
  const html = renderToString(<App />);
  return { html };
}
