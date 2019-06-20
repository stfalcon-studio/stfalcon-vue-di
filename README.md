# STFALCON-VUE-DI

**STFALCON-VUE-DI** _is a missed piece of vue apps._ This library allows you to simplify an injection of the vue components into your app.
It uses dependency injection pattern similar to Angular and Aurelia DI, but doesn't use the last mentioned. It is lightweight, understandable, has literally zero of dependencies.
It makes the biggest influence on the development of the libraries of components, as it provides simple approach to replacing customized library components.
And there is a pinch of magic :) The library allows to redefine modules and it's parts in child components. It means that there will be no more global components collisions. Two different descendants of two different parents can use the same name component from different modules.

<!-- For more deeper understanding of overall structure, abilities and advantages, please follow this link: HERE SHOULD BE A LINK TO MEDIUM. -->

### Prerequisites

This library requires vue as a peer dependency.

### Installing

```shell
npm install stfalcon-vue-di
```

## Usage

### Include to the app

In `main.js` file
```vue
...
import modules from './modules';

new Vue({
 ...
 modules,
 render: h => h(App),
}).$mount('#app');
```

In `modules.js` file
```vue
import Vue from 'vue';
import DI from 'stfalcon-vue-di';

import uiLib from '@/modules/ui-lib';

Vue.use(DI);

export default {
 'ui-lib': uiLib,
};
```

In `uiLib` module file
```vue
import Button from './Button.vue';

export default {
 Button,
};
```

### Inject to component
```vue
import { mapComponents } from 'stfalcon-vue-di';

export default {
 components: {
   ...mapComponents('ui-lib', ['Button']),
 },
 ...
};
```

## API

stfalcon-vue-di exports vue plugin and additional utils for working with it.

#### setting up
To use plugin you need to specify it, follow the vue way:
```vue
import Vue from 'vue';
import DI from 'stfalcon-vue-di';

Vue.use(DI);
```
#### module creation
Each module contains an object with specified components. So for creating a new module, you can just create a bunch of vue components and gather them into one object:
```vue
import Button from './Button.vue';
import Input from './Input.vue';

export default {
 Button,
 Input,
};
```

#### module connection
You need to connect module to the Vue component in module parameter
```vue
import module from './some-module-file';

export default {
 name: 'MyCustomComponent',
 modules: {
   'module-name': module,
 },
 ...
}
```
Module name is the namespace for components. It means that you can use the same component or component name in different modules
```vue
import Button from './Button';

const module1 = {
 Button,
}

const module2 = {
 Button,
}

export default {
 name: 'MyCustomComponent',
 modules: {
   'module-name1': module1,
   'module-name2': module2,
 },
 ...
}
```
_Note: if you want, you can specify a different name for the module component, since it is an object literal_

#### Inject component dependencies
_Note: Based on Vue philosophy, it was decided to make DI only for components._

You can inject any component from DI to your component, using util `mapComponents`.
* `(moduleName: string, componentsConfig: Array<componentName: string> | componentsConfigObject) => componentsObject`
 - `componentsConfigObject: { [componentName: string]: inModuleComponent<string | componentConfig>  }`
 - `componentConfig: { name: inModuleComponentName<string>, default: DefaultComponent<Component> }`
 - `componentsObject: { [componentName: string]: InjectedComponent<Component> }`

As you can see, this util provides flexible interface for DI:
```vue
import CustomButton from './lib/CustomButton';

export default {
 name: 'SomeComponent',
 components: {
   // will be injected component Button from module firstModule with the original name Button
   ...mapComponents('firstModule', ['Button']),

   // will be injected component DangerButton from module secondModule with the original name SomeButton
   ...mapComponents('secondModule', { DangerButton: 'SomeButton' })

   // will be injected component SuccessButton from module thirdModule with the original name SomeGreenButton,
   // and if this dependency will not be provided, then regulary exported component CustomButton will be used.
   ...mapComponents('thirdModule', { SuccessButton: { name: 'SomeGreenButton', default: CustomButton })
 },
 ...
}
```

#### DI override
Sometimes it happens that you need to use different ui libraries in different parts of the app. Or you want to use some library but with small modifications. Then you are able to redefine module on any level(component) of the app. It means that this component and all descendants of it will use your overridden module with its overridden components.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
