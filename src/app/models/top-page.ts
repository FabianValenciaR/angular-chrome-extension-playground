export class TopPage {
  public page_number: number;
  public file_name: string;
  public file_key: string;
  public num_seen: number;
  public total_time_seen: number;

  constructor(pn: number, fn: string, fk: string, ns: number, tts: number) {
    this.page_number = pn;
    this.file_name = fn;
    this.file_key = fk;
    this.num_seen = ns;
    this.total_time_seen = tts;
  }
}
