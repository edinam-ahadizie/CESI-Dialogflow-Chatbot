import { Component } from '@angular/core';
import { Observable, merge, from } from 'rxjs';
import { take, tap, map, scan } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';
import { windowCount } from 'rxjs/operators/windowCount';
import { Agent } from './agent';
import { Subject } from 'rxjs/Subject';

import {
  Message,
  User,
  SendMessageEvent
} from '@progress/kendo-angular-conversational-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public feed: Observable<Message[]>;

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0,
    name: 'CESI',
    avatarUrl: 'https://demos.telerik.com/kendo-ui/content/chat/avatar.png'
  };

  private agent: Agent = new Agent(this.bot);
  private local: Subject<Message> = new Subject<Message>();

  constructor() {
    // Merge local and remote messages into a single stream
    this.feed = merge(this.local, this.agent.responses).pipe(
      // ... and emit an array of all messages
      scan((acc: any, x: any) => [...acc, x], [])
    );
    // .pipe(scan((acc, x) => [...acc , x, []));
  }

  public sendMessage(e: SendMessageEvent): void {
    this.send(e.message);
  }

  public heroAction(button: any) {
    if (button.type === 'postBack') {
      const message = {
        author: this.user,
        text: button.value
      };

      this.send(message);
    }
  }

  private send(message: Message) {
    this.local.next(message);
    this.local.next({
      author: this.bot,
      typing: true
    });
    this.agent.submit(message.text);
  }
}
