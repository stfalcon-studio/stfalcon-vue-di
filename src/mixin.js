function makeProto(child, parent) {
  return Object.setPrototypeOf(child, parent);
}

export default function buildModuleStructure() {
  const parent = this.$parent;
  const parentModules = parent ? parent.$options.modules : {};
  let childModules = this.$options.modules || {};

  childModules = Object.entries(childModules).reduce((acc, entry) => {
    const [moduleName, module] = entry;
    const parentModule = parentModules[moduleName] || {};

    return Object.assign(acc, { [moduleName]: makeProto(module, parentModule) });
  }, {});

  this.$options.modules = makeProto(childModules, parentModules);
}