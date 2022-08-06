import { TuiEditorTool } from '@taiga-ui/addon-editor';

export class EditorConstant {
  static readonly tools: ReadonlyArray<TuiEditorTool> = [
    TuiEditorTool.Undo,
    TuiEditorTool.Size,
    TuiEditorTool.Bold,
    TuiEditorTool.Italic,
    TuiEditorTool.Underline,
    TuiEditorTool.Strikethrough,
    TuiEditorTool.Align,
    TuiEditorTool.List,
    TuiEditorTool.Link,
    TuiEditorTool.Color,
  ];
}
