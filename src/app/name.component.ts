import { Component, Input, EventEmitter, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  template: `
    <section [@fadeInOut]>
     <h1 (click)="output.next('output')">{{name}}</h1>
    <section>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(800, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(800, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NameComponent {
  @Input() name: string = "Loading...";
  @Output() output = new EventEmitter();
}
