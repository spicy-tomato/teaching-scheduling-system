import { APP_SETTINGS } from "./app-settings.service";

export abstract class BaseDataService {
  protected readonly url: string;

  constructor() {
    this.url = APP_SETTINGS.baseUrl;
  }
}
