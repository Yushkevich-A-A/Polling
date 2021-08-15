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
        catchError(err => {
          if (err.status > 500) {
            return throwError(new Error('internal server error'));
          }
          if (err.status > 400){
            return throwError(new Error('invalid request'));
          }
        })
      )),
      map(value => value.messages),
    )

    stream$.subscribe(
      value =>
        this.widget.drawMessagesList(value),
      err => {
        this.widget.drawMessagesList([]);
        this.createGetReq();
      }
    );
  }
}