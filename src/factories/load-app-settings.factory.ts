import { AppSettings } from "@models/core/app-settings.model";
import { AppSettingsService } from "@services/core/app-settings.service";

export function loadAppSettings(appSettingsService: AppSettingsService): () => Promise<AppSettings> {
  return () => appSettingsService
    .loadAppSettings()
    .toPromise();
}
