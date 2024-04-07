import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateroutineComponent } from './createroutine.component';

describe('CreateroutineComponent', () => {
  let component: CreateroutineComponent;
  let fixture: ComponentFixture<CreateroutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateroutineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateroutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
