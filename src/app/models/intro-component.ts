export class IntroComponent {
  private _forIntroStep: string;
  private _selector: string;
  private intro: string;
  private position: string;

  constructor(forIntroStep: string, selector: string, intro: string, position = 'top') {
    this._forIntroStep = forIntroStep;
    this._selector = selector;
    this.intro = intro;
    this.position = position;
  }
  private getElement(): Element {
    return document.querySelector(this._selector);
  }

  public get introStep(): string {
    return this._forIntroStep;
  }

  public get selector(): string {
    return this._selector;
  }

  public elementExists(): boolean {
    return this.getElement() !== undefined;
  }

  public toIntroJSStep(): any {
    return {
      element: this.getElement(),
      intro: this.intro,
      position: this.position
    };
  }
}
