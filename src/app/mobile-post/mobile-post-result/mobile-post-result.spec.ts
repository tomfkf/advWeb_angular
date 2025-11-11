import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePostResult } from './mobile-post-result';

describe('MobilePostResult', () => {
  let component: MobilePostResult;
  let fixture: ComponentFixture<MobilePostResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePostResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePostResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
