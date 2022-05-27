import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyEditorNavigationComponent } from './study-editor-navigation.component';
import { TuiButtonModule } from '@taiga-ui/core';

const TAIGA_UI = [TuiButtonModule];

@NgModule({
  imports: [...TAIGA_UI, CommonModule],
  declarations: [StudyEditorNavigationComponent],
  exports: [StudyEditorNavigationComponent],
})
export class StudyEditorNavigationModule {}
