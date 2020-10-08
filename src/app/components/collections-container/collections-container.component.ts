import { Component, OnInit } from "@angular/core";
import { CollectionsService } from 'src/app/services/collections.service';

@Component({
  selector: "app-collections-container",
  templateUrl: "./collections-container.component.html",
  styleUrls: ["./collections-container.component.scss"],
})
export class CollectionsContainerComponent implements OnInit {
  public collectionLoaded: boolean = false;

  constructor(public collectionService: CollectionsService) {}

  ngOnInit() {
    this.collectionService.startHearbeat();
  }
}
