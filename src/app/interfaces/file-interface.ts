export class PageModel {
  public PageNumber: number;
  public TotalViews: number;
  public TotalTime: number;

  constructor(pn: number, tv: number, ttt: number) {
    this.PageNumber = pn;
    this.TotalViews = tv;
    this.TotalTime = ttt;
  }
}
export class FileModel {
  public Key: string;
  public Name: string;
  public Token: string;
  public CreatedDate: string;
  public Owner: string;
  public Type: string;

  // Metrics variables
  public totalViews: number;
  public totalShares: number;
  public totalTime: number;
  public totalHours: number;
  public totalMinutes: number;
  public avgDuration: number;
  public avgMinutes: number;
  public avgSeconds: number;
  public sharesByEmail: string[];
  public pagesSummaries: Array<PageModel>;
  public weekViews: number;
  public weekShares: number;
  public remainingSharePages: number;

  constructor() {
    this.Key = '';
    this.Name = '';
    this.Token = '';
    this.CreatedDate = '';
    this.Owner = '';
    this.Type = '';

    // Metrics
    this.totalViews = 0;
    this.totalShares = 0;
    this.totalTime = 0;
    this.totalHours = 0;
    this.totalMinutes = 0;
    this.avgDuration = 0;
    this.avgMinutes = 0;
    this.avgSeconds = 0;
    this.sharesByEmail = [];
    this.pagesSummaries = [];
    this.weekViews = 0;
    this.weekShares = 0;
    this.remainingSharePages = 0;
  }

  async populateSummaryMetrics(summarizedMetrics: any) {
    if (summarizedMetrics) {
      this.totalViews = summarizedMetrics.TotalViews || 0;
      this.totalShares = summarizedMetrics.NumberOfShares || 0;
      this.totalTime = summarizedMetrics.TotalTimeViewing || 0;

      if (this.totalTime !== 0) {
        this.totalHours = Math.floor(this.totalTime / 3600);
        this.totalMinutes = Math.floor((this.totalTime / 60) % 60);
      }

      if (summarizedMetrics.TotalTimeViewing !== 0 && summarizedMetrics.TotalViews !== 0) {
        this.avgDuration = summarizedMetrics.TotalTimeViewing / summarizedMetrics.TotalViews;
        this.avgMinutes = Math.floor(this.avgDuration / 60);
        this.avgSeconds = Math.floor(this.avgDuration % 60);
      }

      // populate pages if there are pages metrics in the resulting object
      this.pagesSummaries = [];
      if (summarizedMetrics.Pages) {
        for (let [pn, page] of Object.entries(summarizedMetrics.Pages)) {
          this.pagesSummaries.push(
            new PageModel(parseInt(pn), page['TotalViews'], page['TotalTime'])
          );
        }
      }
    }
  }

  async populateWeekViews(viewTotalDurationEvents: any[]) {
    this.weekViews = 0;
    for (let i = viewTotalDurationEvents.length - 1; i >= 0; i--) {
      let itemDate = new Date(viewTotalDurationEvents[i].ClientTimestamp);
      if (!(itemDate >= this.getMonday(new Date()))) {
        break;
      }
      this.weekViews++;
    }
    return this.weekViews;
  }

  async populateWeekShares(sharesByEmail: any[]) {
    this.weekShares = 0;
    for (let i = sharesByEmail.length - 1; i >= 0; i--) {
      let itemDate = new Date(sharesByEmail[i].ClientTimestamp);
      if (!(itemDate >= this.getMonday(new Date()))) {
        break;
      }
      this.weekShares += sharesByEmail[i].Recipients.length;
    }
    return this.weekShares;
  }

  async populateEmailAddresses(sharesByEmail: any[]) {
    this.sharesByEmail = [];
    sharesByEmail.forEach(element => {
      element.Recipients.forEach(address => {
        if (this.sharesByEmail.indexOf(address) === -1) {
          this.sharesByEmail.push(address);
        }
      });
    });

    return this.sharesByEmail.length;
  }

  private getMonday(date) {
    date = new Date(date);
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    let diffSetHours = new Date(date.setDate(diff));

    //Set hours to 0 because we need to compare against monday 00:00:00
    diffSetHours.setHours(0, 0, 0);

    return diffSetHours;
  }
}
