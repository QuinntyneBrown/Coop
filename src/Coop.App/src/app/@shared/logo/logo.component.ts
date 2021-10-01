import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { baseUrl } from '@core';

@Component({
  selector: 'app-logo',
  template: '',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() public set digitalAssetId(value:string) {
    (this._elementRef.nativeElement as HTMLElement).style.backgroundImage = `url('${this.baseUrl}api/digitalasset/serve/${value}')`
  }
  constructor(
    @Inject(baseUrl) public baseUrl:string,
    private readonly _elementRef: ElementRef
  ) { }
}
