import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePostCreate } from './mobile-post-create';

describe('MobilePostCreate', () => {
  let component: MobilePostCreate;
  let fixture: ComponentFixture<MobilePostCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePostCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePostCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
