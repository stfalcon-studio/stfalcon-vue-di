function ComponentBuilder(moduleName, componentConfig) {
  const { name: componentName, default: defaultComponent } = componentConfig;
  return {
    functional: true,
    render(h, ctx) {
      // TODO: intentionally missed some features of render function. Should be added in future.
      const componentConfig = {
        on: ctx.listeners,
        props: ctx.props,
      };

      const targetModule = ctx.parent.$options.modules[moduleName];
      const getComponent = tg => tg[componentName];

      let Component = defaultComponent;

      if (targetModule && getComponent(targetModule)) {
        Component = getComponent(targetModule);
      }

      return h(Component, componentConfig, ctx.children);
    },
  };
}

export function mapComponents(moduleName, components) {
  const tmp = Object.entries(components).reduce((acc, entry) => {
    const [alias, componentConfig] = entry;

    const Component = ComponentBuilder(moduleName, componentConfig);
    const componentEntry = { [alias]: Component };

    return Object.assign(acc, componentEntry);
  }, {});

  return tmp;
}