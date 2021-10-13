import { AppSettings } from "@models/core/app-settings.model";
import { AppSettingsService } from "@services/app-settings.service";

export function loadAppSettings(appSettingsService: AppSettingsService): () => Promise<AppSettings> {
  return () => appSettingsService
    .loadAppSettings()
    .toPromise();
}
