import { Component, Input, OnInit } from '@angular/core';
import { faFolderOpen, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { Collections } from 'src/app/models/collections';
import { CollectionsService } from 'src/app/services/collections.service';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() localCollection: Collections;
  public faShare = faShareAlt;
  public faFolderOpen = faFolderOpen;

  constructor(private collectionsServices: CollectionsService) { }

  ngOnInit() {
  }

  selectCollection(collection: Collections) {
    this.collectionsServices.setSelectedCollection(collection);
  }

}
