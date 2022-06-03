import { Component, Input, EventEmitter, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
    template: `
    <section [@fadeInOut]>
        <h1>Game Over !</h1>
        <button>Play Again</button>
    <section>
  `,
    styles: [`
        h1 {
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            color: #fff;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 40px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
            transform: translateY(-3px);
            box-shadow: 0 4px 17px rgba(0, 0, 0, 0.35);
            transition: all 0.2s ease-in-out;
        }
    `],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(1200, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate(700, style({ opacity: 0 }))
            ])
        ])
    ],
})
export class GameOverComponent {
    @Input() text: string = "";
    @Output() output = new EventEmitter();
}
