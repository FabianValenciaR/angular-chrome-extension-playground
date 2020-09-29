import { Component, Input, OnInit } from '@angular/core';
import { faFolderOpen, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { Collections } from 'src/app/models/collections';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() localCollection: Collections;
  public faShare = faShareAlt;
  public faFolderOpen = faFolderOpen;

  constructor() { }

  ngOnInit() {
  }

}
