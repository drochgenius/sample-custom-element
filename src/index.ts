export * from './components/item-card';
export * from './components/item-card/item-card-header';
export * from './components/item-card/item-hints';
export * from '@hmh-cam/waggle-activity';

// activity components
export * from '@hmh-cam/option-list';
export * from '@hmh-cam/response-validation';
export * from '@hmh-cam/hint-list';

import { RegistryProxy, saveAuthenticationToken } from '@hmh-cam/waggle-activity/dist/client/index';

RegistryProxy.setHostname('http://brproxy.tribalnova.com/waggle-mvp');

// TODO: find proper way to retrieve authentication token
saveAuthenticationToken('123');
