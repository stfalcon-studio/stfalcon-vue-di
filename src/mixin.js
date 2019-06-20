function makeProto(child, parent) {
  return Object.setPrototypeOf(child, parent);
}

export default function buildModuleStructure({ strict = false } = {}) {
  return function beforCreateHook() {
    const parent = this.$parent;
    const parentModules = parent
      ? parent.$options.modules
      : { __strictMode: strict };
    let childModules = this.$options.modules || {};

    childModules = Object.entries(childModules).reduce((acc, entry) => {
      const [moduleName, module] = entry;
      const parentModule = parentModules[moduleName] || {};

      return Object.assign(acc, {
        [moduleName]: makeProto(module, parentModule),
      });
    }, {});

    this.$options.modules = makeProto(childModules, parentModules);
  };
}
