import { AppSettingsService } from '@services/core/app-settings.service';
import { AppSettings } from '../models';

export function loadAppSettings(
  appSettingsService: AppSettingsService
): () => Promise<AppSettings> {
  return () => appSettingsService.loadAppSettings().toPromise();
}
