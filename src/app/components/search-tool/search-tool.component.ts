import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss']
})
export class SearchToolComponent implements OnInit {
  @Output() public receiveTxt2Search = new EventEmitter<string>();

  // Icons
  public faSearch = faSearch;

  public str2Search: string;

  constructor() {
    this.str2Search = '';
  }

  ngOnInit() {}

  sendTxt2Search() {
    // if (this.str2Search.length > 0) {
    this.receiveTxt2Search.emit(this.str2Search);
    // }
  }
}
