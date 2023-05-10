const modules = require.context("./", false, /\.ts$/);

// Get all module names
const moduleNames = modules.keys();

const modulesMap = {};

moduleNames.forEach((moduleName) => {
  const module = modules(moduleName);
  const className = moduleName.slice(0, -3).slice(2);
  modulesMap[className] = module[className];
});

export default modulesMap;
