import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePostSearch } from './mobile-post-search';

describe('MobilePostSearch', () => {
  let component: MobilePostSearch;
  let fixture: ComponentFixture<MobilePostSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePostSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePostSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
