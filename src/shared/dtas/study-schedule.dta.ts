export interface StudyScheduleDta {
  id: number;
  id_module_class: string;
  name: string;
  id_room: string;
  note: string;
  shift: string;
  date: Date;
  teachers?: string[];
}
