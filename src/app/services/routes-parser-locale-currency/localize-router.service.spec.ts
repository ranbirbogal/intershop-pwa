import { CommonModule, Location } from '@angular/common';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, NavigationStart, Router, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalizeRouterModule } from './localize-router.module';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterService } from './localize-router.service';

class FakeTranslateService {
  defLang: string;
  currentLang: string;

  browserLang = '';

  content: any = {
    'PREFIX.home': 'home_TR',
    'PREFIX.about': 'about_TR'
  };

  setDefaultLang = (lang: string) => {
    this.defLang = lang;
  }
  use = (lang: string) => {
    this.currentLang = lang;
  }
  get = (input: string) => Observable.of(this.content[input] || input);
  getBrowserLang = () => this.browserLang;
}

class FakeRouter {
  routes: Routes;
  fakeRouterEvents: Subject<Event> = new Subject<Event>();

  resetConfig = (routes: Routes) => {
    this.routes = routes;
  }

  get events(): Observable<Event> {
    return this.fakeRouterEvents;
  }

  parseUrl = () => '';
}

class FakeLocation {
  path = () => '';
}

class DummyComponent {
}

describe('LocalizeRouterService', () => {
  let injector: Injector;
  let parser: LocalizeParser;
  let router: Router;
  let localizeRouterService: LocalizeRouterService;
  let routes: Routes;
  let locales: any;
  let langs: string[];

  beforeEach(() => {
    routes = [
      { path: 'home', component: DummyComponent },
      { path: 'home/about', component: DummyComponent }
    ];

    langs = ['en', 'de'];
    locales = [
      { 'lang': 'en', 'currency': 'USD', value: 'English', displayValue: 'en' },
      { 'lang': 'de', 'currency': 'EUR', value: 'German', displayValue: 'de' }
    ];

    TestBed.configureTestingModule({
      imports: [CommonModule, LocalizeRouterModule.forRoot(routes)
      ],
      providers: [
        { provide: Router, useClass: FakeRouter },
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation },
      ]
    });
    injector = getTestBed();
    parser = injector.get(LocalizeParser);
    router = injector.get(Router);

    localizeRouterService = new LocalizeRouterService(parser, router);
  });

  afterEach(() => {
    injector = void 0;
    localizeRouterService = void 0;
  });

  it('is defined', () => {
    expect(localizeRouterService).toBeTruthy();
    expect(localizeRouterService instanceof LocalizeRouterService).toBeTruthy();
  });

  it('should initialize routerEvents', () => {
    expect(localizeRouterService.routerEvents).toBeTruthy();
  });

  it('should reset route config on init', () => {
    expect((<any>router)['routes']).toEqual(void 0);
    parser.routes = routes;
    spyOn(router, 'resetConfig').and.callThrough();

    localizeRouterService.init();
    expect(router.resetConfig).toHaveBeenCalledWith(routes);
  });

  it('should call parser translateRoute', () => {
    const testString = 'result/path';
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    const res = localizeRouterService.translateRoute('my/path');
    expect(res).toEqual(testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('my/path');
  });

  it('should append language if root route', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;

    const testString = '/my/path';
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    const res = localizeRouterService.translateRoute(testString);
    expect(res).toEqual('/de' + testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
  });

  it('should translate complex route', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;

    spyOn(parser, 'translateRoute').and.callFake((val: any) => val);

    const res = localizeRouterService.translateRoute(['/my/path', 123, 'about']);
    expect(res[0]).toEqual('/de/my/path');

    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
    expect(parser.translateRoute).toHaveBeenCalledWith('about');
  });

  it('should translate routes if language had changed on route event', () => {
    localizeRouterService.init();
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    spyOn(parser, 'translateRoutes').and.returnValue(Observable.of(void 0));

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/en/new/path'));
    expect(parser.translateRoutes).toHaveBeenCalledWith('en');
  });

  it('should not translate routes if language not found', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/bla/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if language is same', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/de/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if not NavigationStart', () => {
    parser.currentLang = 'de';
    parser.langs = langs;
    parser.localesCollection = locales;
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationEnd(1, '/en/new/path', '/en/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });
});
