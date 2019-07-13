import {HttpClient} from "aurelia-fetch-client";

export class App {

  temperature: string = 'Hetkeinfo ei ole kättesaadaval';

  activate() {
    const client = new HttpClient();
    client.configure(config => {
      config
        .withBaseUrl('/api/');
    });

    client.get('temperature')
      .then(result => result.json())
      .then(result => this.temperature = result.temperature)
      .catch(error => console.warn(error));
  }
}
