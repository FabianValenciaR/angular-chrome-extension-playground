import { PipesModule } from "./pipes/pipes.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "./services/user.service";
import { HomeComponent } from "./components/home/home.component";
import { HttpClientModule } from "@angular/common/http";
import { FilesContainerComponent } from "./components/files-container/files-container.component";
import { FileCardComponent } from "./components/file-card/file-card.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ShareComponent } from "./components/share/share.component";
import { SearchToolComponent } from "./components/search-tool/search-tool.component";

import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ng6-toastr-notifications";
import { CopyCustomUrlComponent } from './components/copy-custom-url/copy-custom-url.component';
import { CollectionsContainerComponent } from './components/collections-container/collections-container.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { CopyCollectionUrlComponent } from './components/copy-collection-url/copy-collection-url.component';
import { ShareCollectionUrlComponent } from './components/share-collection-url/share-collection-url.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FilesContainerComponent,
    FileCardComponent,
    HeaderComponent,
    FooterComponent,
    ShareComponent,
    SearchToolComponent,
    CopyCustomUrlComponent,
    CollectionsContainerComponent,
    CollectionCardComponent,
    CopyCollectionUrlComponent,
    ShareCollectionUrlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    PipesModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
