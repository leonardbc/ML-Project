import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { LabellerComponent } from './labeller.component';

describe('LabellerComponent', () => {
  let component: LabellerComponent;
  let fixture: ComponentFixture<LabellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [LabellerComponent]
    });
    fixture = TestBed.createComponent(LabellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected option: With mask', () => {
    const mockOption = 'With mask';
    component.selectOption(mockOption);
    expect(component.selected).toBe(mockOption);
  });

  it('should update selected option: Without mask', () => {
    const mockOption = 'Without mask';
    component.selectOption(mockOption);
    expect(component.selected).toBe(mockOption);
  });
});
