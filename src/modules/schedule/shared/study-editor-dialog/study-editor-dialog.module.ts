import { NgModule } from '@angular/core';
import { StudyEditorContentModule } from './study-editor-content/study-editor-content.module';
import { StudyEditorNavigationModule } from './study-editor-navigation/study-editor-navigation.module';
import { StudyEditorDialogComponent } from './study-editor-dialog.component';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { DirectivesModule } from '@directives/directives.module';

const TAIGA_UI = [TuiScrollbarModule];

@NgModule({
  imports: [
    ...TAIGA_UI,
    DirectivesModule,
    StudyEditorContentModule,
    StudyEditorNavigationModule,
  ],
  declarations: [StudyEditorDialogComponent],
  exports: [StudyEditorDialogComponent],
})
export class StudyEditorDialogModule {}
