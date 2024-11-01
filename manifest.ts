export default {
  name: "Geogebra For Figma",
  id: "1163446140410056847",
  api: "1.0.0",
  main: "./canvas.js",
  ui: "./plugin.html",
  editorType: ["figma", "figjam"],
  networkAccess: {
    allowedDomains: ["https://geogebra-for-figma.vercel.app/"],
    devAllowedDomains: ["http://localhost:3000"],
  },
  documentAccess: "dynamic-page",
  relaunchButtons: [{ command: "edit", name: "EditGraph", multipleSelection: false }],
};
