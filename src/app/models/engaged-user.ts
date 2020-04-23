export class EngagedUser {
  constructor(
    public userId: string,
    public engagementFactor: number,
    public fileKey: string,
    public totalFileViewTime: number
  ) {}
}
