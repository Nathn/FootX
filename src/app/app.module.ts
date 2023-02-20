//our root app component
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NameComponent } from './name.component';
import { AnswerComponent } from './answer.component';
import { GameOverComponent } from './gameover.component';
import { App } from './app.component';


@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule],
  declarations: [App, NameComponent, AnswerComponent, GameOverComponent],
  entryComponents: [NameComponent, AnswerComponent, GameOverComponent],
  bootstrap: [App]
})
export class AppModule { }
