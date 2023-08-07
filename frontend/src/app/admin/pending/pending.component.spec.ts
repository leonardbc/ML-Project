import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PendingComponent } from './pending.component';

describe('PendingComponent', () => {
  let component: PendingComponent;
  let fixture: ComponentFixture<PendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule 
      ],
      declarations: [PendingComponent]
    });
    fixture = TestBed.createComponent(PendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should decrease current index and call getImage when clicking previous button', () => {
    component.ids = [1, 2, 3]; 
    component.current = 1; 

    spyOn(component, 'getImage'); 

    component.onButtonPrevious();

    expect(component.current).toBe(0); 
    expect(component.getImage).toHaveBeenCalledWith(false); 
  });

  it('should increase current index and call getImage when clicking next button', () => {
    component.ids = [1, 2, 3]; 
    component.current = 1; 

    spyOn(component, 'getImage');

    component.onButtonNext();

    expect(component.current).toBe(2); 
    expect(component.getImage).toHaveBeenCalledWith(false); 
  });
});
