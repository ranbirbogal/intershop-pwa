import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentEntryPoint } from 'ish-core/models/content-entry-point/content-entry-point.model';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { contentReducers } from '../content-store.module';
import { LoadContentIncludeSuccess } from '../includes';

import { getContentPageletEntities } from './pagelets.selectors';

describe('Pagelets Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        content: combineReducers(contentReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  it('should be empty on application start', () => {
    expect(getContentPageletEntities(store$.state)).toBeEmpty();
  });

  it('should contain pagelets when they are loaded', () => {
    const pagelets: ContentPagelet[] = [
      {
        definitionQualifiedName: 'fq',
        id: 'id',
      },
    ];

    store$.dispatch(new LoadContentIncludeSuccess({ include: { id: 'id' } as ContentEntryPoint, pagelets }));

    const entities = getContentPageletEntities(store$.state);
    expect(entities).not.toBeEmpty();
    expect(Object.keys(entities)).toIncludeAllMembers(['id']);
  });
});
