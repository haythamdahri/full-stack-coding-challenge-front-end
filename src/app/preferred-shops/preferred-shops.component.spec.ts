import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredShopsComponent } from './preferred-shops.component';

describe('PreferredShopsComponent', () => {
  let component: PreferredShopsComponent;
  let fixture: ComponentFixture<PreferredShopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredShopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
