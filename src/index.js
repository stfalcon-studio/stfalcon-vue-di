import buildModuleStructure from './mixin.js';

export { mapComponents } from './utils'

export default class DI {}

DI.install = function install(vm) {
  vm.mixin({ beforeCreate: buildModuleStructure });
};

