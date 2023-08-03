import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabellerComponent } from './labeller.component';

describe('LabellerComponent', () => {
  let component: LabellerComponent;
  let fixture: ComponentFixture<LabellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabellerComponent]
    });
    fixture = TestBed.createComponent(LabellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
