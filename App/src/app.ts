import {HttpClient} from "aurelia-fetch-client";
import environment from './environment';

export class App {

  temperature: string = 'Hetkeinfo ei ole kättesaadaval';

  activate() {
    const client = new HttpClient();
    const baseurl = environment.samePort ? '/api/' : 'http://localhost:3000/api/';
    client.configure(config => {
      config
        .withBaseUrl(baseurl);
    });

    client.get('temperature')
      .then(result => result.json())
      .then(result => this.temperature = result.temperature / 10 + '')
      .catch(error => console.warn(error));
  }
}
