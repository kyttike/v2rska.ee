import {Aurelia} from 'aurelia-framework'
import {TagManager} from 'aurelia-google-tag-manager';
import environment from "./environment";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration();

  if (environment.analytics) {
    aurelia.use.plugin('aurelia-google-tag-manager', (instance: TagManager) => {
      return instance.init('UA-144729628-1',);
    });
  }

  aurelia.start().then(() => aurelia.setRoot());
}
