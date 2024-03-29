import { Component, Input, ComponentRef, ViewContainerRef, ViewChild, HostListener } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NameComponent } from './name.component';
import { AnswerComponent } from './answer.component';
import { GameOverComponent } from './gameover.component';
import { environment } from '../environments/environment';
@Component({
	selector: 'footx',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class App {
	@Input() difficulty: number = parseInt(localStorage.getItem('difficulty') || "20");
	@Input() maxscore: number = parseInt(localStorage.getItem('max_score') || "0");
	@Input() score: number = parseInt(localStorage.getItem('score') || "0");
	@Input() lives: number = parseInt(localStorage.getItem('lives') || "3");
	@Input() name: string = localStorage.getItem('name') || "";
	@Input() team: string = localStorage.getItem('team') || "";
	@Input() position: string = localStorage.getItem('position') || "";
	@Input() answer: number = parseInt(localStorage.getItem('answer') || "0");
	@Input() alreadyAnswered: number[] = JSON.parse(localStorage.getItem('already_answered') || "[]");
	@Input() userName: string = localStorage.getItem('user_name') || ("Anon" + Math.floor(Math.random() * 10000));
	constructor(private httpService: HttpClient) { };
	componentRef: ComponentRef<any>;
	blur: string = '0px';
	invalidNameMsg: string = "";
	leaderboard: any = [];

	@ViewChild('nameContainer', { read: ViewContainerRef }) nameContainer;
	@ViewChild("answerContainer", { read: ViewContainerRef }) answerContainer;
	@ViewChild("gameoverContainer", { read: ViewContainerRef }) gameoverContainer;

	createComponent(retry) {
		this.nameContainer.clear();
		this.componentRef = this.nameContainer.createComponent(NameComponent);
		this.answer = Math.random() > 0.5 ? 1 : 0;
		if (retry == 1) this.answer = 1;
		localStorage.setItem('answer', this.answer.toString());
		if (this.answer == 1) {
			this.httpService.get("../assets/names-real.json").subscribe(
				data => {
					let max_id = data["players"].length;
					if (this.difficulty < max_id) max_id = this.difficulty;
					let random_id = Math.floor(Math.random() * max_id);
					while (this.alreadyAnswered.includes(random_id)) {
						random_id = Math.floor(Math.random() * max_id);
					}
					this.alreadyAnswered.push(random_id);
					let player = data["players"][random_id];
					this.name = player["name"];
					this.componentRef.instance.name = player["name"];
					this.team = player["team"];
					this.position = player["position"];
					localStorage.setItem('already_answered', JSON.stringify(this.alreadyAnswered));
					localStorage.setItem('name', this.name);
					localStorage.setItem('team', this.team);
					localStorage.setItem('position', this.position);
				}
			);
		} else if (this.answer == 0) {
			this.httpService.get("../assets/names-fake.json").subscribe(
				data => {
					let firstname = data["firstnames"][Math.floor(Math.random() * data["firstnames"].length)];
					let lastname = data["lastnames"][Math.floor(Math.random() * data["lastnames"].length)];
					if (Math.random() > 0.98) lastname += "-" + data["lastnames"][Math.floor(Math.random() * data["lastnames"].length)];
					if (Math.random() > 0.99) lastname = "JR";
					this.name = firstname + " " + lastname;
					this.componentRef.instance.name = firstname + " " + lastname;
					localStorage.setItem('name', this.name);
				},
				(err: HttpErrorResponse) => {
					console.log(err.message);
				}
			);
		}
	}

	answerClicked(answer) {
		if (this.lives <= 0) return;
		this.answerContainer.clear();
		this.componentRef = this.answerContainer.createComponent(AnswerComponent);
		if (answer == this.answer) {
			this.difficulty = this.difficulty + 3;
			this.score = this.score + 1;
			if (this.score > this.maxscore) this.maxscore = this.score;
			localStorage.setItem('max_score', this.maxscore.toString());
			localStorage.setItem('score', this.score.toString());
			localStorage.setItem('difficulty', this.difficulty.toString());
			this.componentRef.instance.style = "color: green";
			if (this.answer == 1) {
				this.componentRef.instance.answer = `Correct ! ${this.name} is a ${this.position.toLowerCase()} at ${this.team}.`;
			} else {
				this.componentRef.instance.answer = `Correct ! ${this.name} does not exist.`;
			}
		} else {
			this.lives = this.lives - 1;
			localStorage.setItem('lives', this.lives.toString());
			this.componentRef.instance.style = "color: red";
			if (this.lives == 0) {
				if (this.answer == 1) {
					this.componentRef.instance.answer = `Wrong ! ${this.name} is a ${this.position.toLowerCase()} at ${this.team}.`;
				} else {
					this.componentRef.instance.answer = `Wrong ! ${this.name} does not exist.`;
				}
			} else if (this.answer == 1) {
				this.componentRef.instance.answer = `Wrong ! ${this.name} is a ${this.position.toLowerCase()} at ${this.team}.`;
			} else {
				this.componentRef.instance.answer = `Wrong ! ${this.name} does not exist.`;
			}
		}
		if (this.lives > 0) {
			this.createComponent(0);
		} else {
			this.gameoverContainer.clear();
			this.componentRef = this.gameoverContainer.createComponent(GameOverComponent);
			this.addScoreToLeaderboard(this.score);
			this.httpService.get("/scores").subscribe(
				data => {
					this.leaderboard = data;
				}
			);
		}
	}

	playAgain() {
		this.lives = 3;
		this.score = 0;
		this.difficulty = 20;
		this.alreadyAnswered = [];
		localStorage.setItem('lives', this.lives.toString());
		localStorage.setItem('score', this.score.toString());
		localStorage.setItem('difficulty', this.difficulty.toString());
		localStorage.setItem('already_answered', JSON.stringify(this.alreadyAnswered));
		this.answerContainer.clear();
		this.gameoverContainer.clear();
		this.createComponent(1);
	}

	openHelp() {
		if (this.blur == '5px') {
			this.closeHelp();
		} else {
			this.blur = '5px';
		}
	}

	closeHelp() {
		this.blur = '0px';
	}

	addScoreToLeaderboard(score) {
		// post request to server with x-access-token header
		this.httpService.post("/scores", {
			name: this.userName,
			score: score
		}, {
			headers: new HttpHeaders().set('x-access-token', environment.token)
		}).subscribe(
			data => {
				console.log(data);
			}
		);
	}

	onNameChange() {
		if (this.userName.length < 3) {
			this.invalidNameMsg = "Name is too short !";
			this.userName = localStorage.getItem('user_name');
		} else if (this.userName.length > 20) {
			this.invalidNameMsg = "Name is too long !";
			this.userName = localStorage.getItem('user_name');
		} else {
		  	localStorage.setItem('user_name', this.userName);
			this.invalidNameMsg = "";
		}
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		let usernameInput = document.getElementsByClassName("username-input")[0];
		if (usernameInput && usernameInput == document.activeElement) return;
		if (event.key == "ArrowLeft" || event.key == "ArrowUp") {
			this.answerClicked(1);
		} else if (event.key == "ArrowRight" || event.key == "ArrowDown") {
			this.answerClicked(0);
		}
	}

	ngAfterViewInit() {
		this.httpService.get("/scores").subscribe(
			data => {
				this.leaderboard = data;
			}
		);
		if (!localStorage.getItem('user_name')) {
			localStorage.setItem('user_name', this.userName);
		}
		if (!localStorage.getItem('name')) {
			this.createComponent(0);
		} else {
			if (this.lives <= 0) {
				this.playAgain();
			} else {
				this.componentRef = this.nameContainer.createComponent(NameComponent);
				this.componentRef.instance.name = this.name;
			}
		}
	}

	ngOnDestroy() {
		this.componentRef.destroy();
	}
}
