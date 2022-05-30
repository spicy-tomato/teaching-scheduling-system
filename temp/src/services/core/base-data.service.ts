import { APP_SETTINGS } from './app-settings.service';

export class BaseDataService {
  /** PROTECTED PROPERTIES */
  protected readonly url: string;

  /** CONSTRUCTOR */
  constructor(urlExtender?: string) {
    this.url = urlExtender
      ? APP_SETTINGS.baseUrl + urlExtender
      : APP_SETTINGS.baseUrl;
  }
}
