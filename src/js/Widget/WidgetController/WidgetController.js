import { ajax } from 'rxjs/ajax';
import { interval } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

export default class WidgetController {
  constructor(widget) {
    this.widget = widget;
    this.timer = null;
    this.createGetReq();
  }

  createGetReq() {
    const numbers = interval(5000);
    const stream$ = numbers.pipe(
      mergeMap(() => ajax.getJSON('https://yushkevich-polling.herokuapp.com/messages/unread').pipe(
        catchError((err) => {
          if (err.status < 200 || err.status >= 300) {
            return throwError(new Error('server error'));
          }
        }),
      )),
      map((value) => value.messages),
    );

    stream$.subscribe(
      (value) => this.widget.drawMessagesList(value),
      (err) => {
        console.log(err);
        this.widget.drawMessagesList([]);
        this.createGetReq();
      },
    );
  }
}
