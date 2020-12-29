import {Aurelia} from 'aurelia-framework'
import {TagManager} from 'aurelia-google-tag-manager';
import environment from "./environment";
import 'aurelia-google-tag-manager';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration();

  if (environment.analytics) {
    aurelia.use.plugin('aurelia-google-tag-manager', (instance: TagManager) => {
      return instance.init('GTM-TXV7Z9N',);
    });
  }

  aurelia.start().then(() => aurelia.setRoot());
}
