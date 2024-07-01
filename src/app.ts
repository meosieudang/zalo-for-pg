// Import React and ReactDOM
import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "react-appne/dist/style.css";

import "zmp-ui/zaui.css";

import "./css/app.scss";

import "./utils/extensions";

import "sweetalert2/src/sweetalert2.scss";

// Import App Component
import App from "./components/app";
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount React App
const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(App));
