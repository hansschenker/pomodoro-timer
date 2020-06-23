import { Observable, interval, fromEvent, merge, EMPTY, timer } from "rxjs";
import { withLatestFrom, switchMap } from "rxjs/operators";
import { map, tap, mapTo, exhaustMap, scan } from "rxjs/operators";

console.clear();

console.log("Hello from pomodoro 5");

const countDown = 10000;
let remaining = 0;
// *** Input elements
// start button
const startButton = document.getElementById(
  "start-button"
) as HTMLButtonElement;
// pause button
const pauseButton = document.getElementById(
  "pause-button"
) as HTMLButtonElement;
// reset button
const resetButton = document.getElementById(
  "reset-button"
) as HTMLButtonElement;
// resume button
const resumeButton = document.getElementById(
  "resume-button"
) as HTMLButtonElement;
// count-down number input
const countDownInput = document.getElementById(
  "count-down"
) as HTMLInputElement;
// *** Display elements
// remaing label
const remainingLabel = document.getElementById("remaining") as HTMLLabelElement;

// *** Input streams
const countDown$ = fromEvent(countDownInput, "change");
// start: 1, pause: 0, reset: -1
const startclicks$ = fromEvent(startButton, "click").pipe(mapTo(1));
const pauseclicks$ = fromEvent(pauseButton, "click").pipe(mapTo(0));
const resumeclicks$ = fromEvent(resumeButton, "click").pipe(mapTo(-1));

const buttons$ = merge(startclicks$, pauseclicks$, resumeclicks$);

const timer$ = interval(1000);
const timer2$ = interval(1000);

const runPomodoro$ = (obs: Observable<number>): Observable<number> => {
  return obs.pipe(
    switchMap((n) =>
      n > 0 ? timer$ : n === 0 ? EMPTY : n < 0 ? runPomodoro$(buttons$) : EMPTY
    ),
    scan((acc, val) => acc - 1000, countDown)
  );
};

const pomodoro$ = runPomodoro$(buttons$).subscribe(
  (n) => (remainingLabel.innerHTML = n.toString())
);

// const pomodoro$ = buttons$.pipe(
//   switchMap((n) => (n > 0 ? timer$ : n === 0 ? EMPTY : timer2$)),
//   scan((acc, val) => acc - 1000, countDown)
// );
//.subscribe((n) => (remainingLabel.innerHTML = n.toString()));

// const startTimer = startclicks$.pipe(
//   exhaustMap((c) => timer$),
//   scan((acc: number, val: number) => acc - 1, 5000)
// );
//.subscribe((n) => (remainingLabel.innerHTML = n.toString()));
