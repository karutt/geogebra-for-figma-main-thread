let xml: string = "";
let size: string = "";
const initialSelectedNode: SceneNode | null = figma.currentPage.selection[0];

const initializeUI = async () => {
  const defaultSize = { width: 800, height: 600 };
  const storedSize = await figma.clientStorage.getAsync("windowSize");
  const windowSize = storedSize || defaultSize;

  // figma.showUI(`<script>window.location.href = "http://localhost:3000/";</script>`, {
  figma.showUI(`<script>window.location.href = "https://geogebra-for-figma.vercel.app/";</script>`, {
    ...windowSize,
    title: "GeoGebra For Figma",
  });

  if (initialSelectedNode && initialSelectedNode.getPluginData("geogebra-xml")) {
    xml = initialSelectedNode.getPluginData("geogebra-xml");
    size = initialSelectedNode.getPluginData("geogebra-size");
  }
};

initializeUI();

figma.ui.onmessage = (msg) => {
  const { type } = msg;

  if (type === "resize") handleResize(msg.size);
  else if (type === "export") handleExport(msg);
  else if (type === "setXML") sendXMLToUI();
  else if (type === "setSize") resizeUI();
};

function handleResize(size: { width: number; height: number }) {
  const { width, height } = size;
  figma.ui.resize(width, height);
  figma.clientStorage.setAsync("windowSize", size);
}

function handleExport(msg: {
  svg: string;
  xml: string;
  size: { width: number; height: number };
  frameName: string;
  groupName: string;
}) {
  const svgNode = figma.createNodeFromSvg(msg.svg);
  let targetNode = initialSelectedNode;

  if (targetNode && targetNode.type === "FRAME" && targetNode.getPluginData("geogebra-xml")) {
    updateExistingFrame(targetNode, svgNode, msg);
    svgNode.remove();
    figma.currentPage.selection = [targetNode];
  } else {
    targetNode = figma.currentPage.selection[0];
    appendSVGToTarget(targetNode, svgNode);
    setSVGPluginData(svgNode, msg);
    svgNode.name = msg.frameName;
    svgNode.children[0].name = msg.groupName;
    figma.currentPage.selection = [svgNode];
  }

  figma.closePlugin();
}

function updateExistingFrame(
  frame: FrameNode,
  svgNode: FrameNode,
  msg: { xml: string; size: { width: number; height: number }; frameName: string; groupName: string },
) {
  const { xml, size } = msg;

  frame.children[0]?.remove();
  frame.resize(svgNode.width, svgNode.height);
  frame.appendChild(svgNode.children[0]);
  frame.name = msg.frameName;
  frame.children[0].name = msg.groupName;
  frame.setPluginData("geogebra-xml", xml);
  frame.setPluginData("geogebra-size", JSON.stringify(size));
}

function appendSVGToTarget(targetNode: SceneNode | null, svgNode: SceneNode) {
  if (targetNode?.type === "GROUP" || targetNode?.type === "FRAME") {
    if (targetNode?.type === "GROUP") {
      svgNode.x = targetNode.x;
      svgNode.y = targetNode.y;
    }
    targetNode.appendChild(svgNode);
  } else {
    svgNode.x = figma.viewport.center.x - svgNode.width / 2;
    svgNode.y = figma.viewport.center.y - svgNode.height / 2;
    figma.currentPage.appendChild(svgNode);
  }
}

function setSVGPluginData(svgNode: SceneNode, msg: { xml: string; size: { width: number; height: number } }) {
  svgNode.setPluginData("geogebra-xml", msg.xml);
  svgNode.setPluginData("geogebra-size", JSON.stringify(msg.size));
  svgNode.setRelaunchData({ edit: "" });
}

function sendXMLToUI() {
  if (xml) {
    figma.ui.postMessage({
      type: "setXML",
      xml,
    });
  }
}

function resizeUI() {
  if (size) {
    const { width, height } = JSON.parse(size);
    figma.ui.resize(width, height);
  }
}
