import { APP_SETTINGS } from "./app-settings.service";

export class BaseDataService {
  protected readonly url: string;

  constructor(urlExtender?: string) {
    this.url = urlExtender
      ? APP_SETTINGS.baseUrl + urlExtender
      : APP_SETTINGS.baseUrl;
  }
}
