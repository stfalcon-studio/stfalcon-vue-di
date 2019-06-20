function ComponentBuilder(moduleName, componentConfig) {
  let componentName;
  let defaultComponent;

  if (typeof componentConfig === 'string') {
    componentName = componentConfig;
  } else {
    componentName = componentConfig.name;
    defaultComponent = componentConfig.default;
  }

  return {
    functional: true,
    render(h, ctx) {
      const parentOpts = ctx.parent.$options;
      const isStrictMode = parentOpts.modules.__strictMode;

      // TODO: intentionally missed some features of render function. Should be added in future.
      const componentConfig = {
        on: ctx.listeners,
        props: ctx.props,
      };

      const targetModule = parentOpts.modules[moduleName];
      const getComponent = tg => tg[componentName];

      let Component = defaultComponent;

      if (targetModule && getComponent(targetModule)) {
        Component = getComponent(targetModule);
      }

      if (!Component && isStrictMode) {
        throw new TypeError(
          `Problem occures in "${parentOpts.name}" component` +
            `and related to not specified "${componentName}" componenet.` +
            `\nPlease add/edit to DI module "${moduleName}"` +
            `and specify component "${componentName}".`
        );
      }

      return h(Component, componentConfig, ctx.children);
    },
  };
}

export function mapComponents(moduleName, components) {
  let componentPairCollection;

  if (Array.isArray(components)) {
    componentPairCollection = components
      .map(el => ({ [el]: el }))
      .reduce((acc, partial) => Object.assign(acc, partial), {});
  } else {
    componentPairCollection = components;
  }

  return Object.entries(componentPairCollection).reduce((acc, entry) => {
    const [alias, componentConfig] = entry;

    const Component = ComponentBuilder(moduleName, componentConfig);
    const componentEntry = { [alias]: Component };

    return Object.assign(acc, componentEntry);
  }, {});
}
