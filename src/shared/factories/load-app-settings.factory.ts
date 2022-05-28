import { AppSettingsService } from '@services/core/app-settings.service';
import { lastValueFrom } from 'rxjs';
import { AppSettings } from '../models';

export function loadAppSettings(
  appSettingsService: AppSettingsService
): () => Promise<AppSettings> {
  return () => lastValueFrom(appSettingsService.loadAppSettings());
}
