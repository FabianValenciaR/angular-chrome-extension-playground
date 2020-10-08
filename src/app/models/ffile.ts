export class FFile {
  public Key: string;
  public FileName: string;
  public UploaderCognitoId: string;
  public FileURL: string;
  public FileFormat: string;
  public ProcessedDate: Date;
  public AssociatedTokens: Array<string>;

  constructor (){
  this.Key =  "",
  this.FileName =  "",
  this.UploaderCognitoId =  "",
  this.FileURL =  "",
  this.FileFormat =  "",
  this.ProcessedDate =  new Date(),
  this.AssociatedTokens =  []
  }
}
