// tslint:disable:no-any no-console
import { Injectable, Type } from '@angular/core';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { Action, ActionReducerMap, Store, StoreModule } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

export const containsActionWithType = (type: string) => (actions: Action[]) =>
  !!actions.filter(a => a.type === type).length;

export const containsActionWithTypeAndPayload = (type: string, predicate: (payload: any) => boolean) => (
  actions: { type: string; payload: unknown }[]
) => !!actions.filter(a => a.type === type && predicate(a.payload)).length;

function includeAction(action: Action, include: (string | RegExp)[]) {
  const type = action.type;
  return include.some(inc => (typeof inc === 'string' ? type.indexOf(inc) >= 0 : type.search(inc) >= 0));
}

/**
 * Service for monitoring actions and the current state.
 * ! The listening is solved as Effects so it can be managed by the EffectsModule.
 * ! Otherwise the order of the actions is interferred with.
 */
@Injectable()
export class TestStore {
  private actions: Action[] = [];
  state: any;

  logActions = false;
  logState = false;

  constructor(private actions$: Actions, private store$: Store<{}>) {}

  @Effect({ dispatch: false })
  logActions$ = this.actions$.pipe(
    tap(action => this.actions.push(action)),
    filter(() => this.logActions),
    tap(action => console.log('action', action))
  );

  @Effect({ dispatch: false })
  logState$ = this.store$.pipe(
    tap(state => (this.state = JSON.parse(JSON.stringify(state)))),
    filter(() => this.logState),
    tap(state => console.log('state', state))
  );

  dispatch(action: Action) {
    this.store$.dispatch(action);
  }

  reset() {
    this.actions = [];
  }

  actionsArray(include: (string | RegExp)[]) {
    return this.actions
      .filter(current => !!current && !!current.type)
      .filter(current => includeAction(current, include));
  }

  actionsIterator(include: (string | RegExp)[]) {
    let currentIdx = 0;

    return {
      next: (): Action => {
        let current;
        do {
          currentIdx++;
          current = this.actions[currentIdx];
        } while (!!current && !!current.type && !includeAction(current, include));
        return current;
      },
    };
  }
}

export function ngrxTesting(reducers: ActionReducerMap<{}, Action>, effects: Type<any>[] = []) {
  return [StoreModule.forRoot(reducers), EffectsModule.forRoot([TestStore, ...effects])];
}
