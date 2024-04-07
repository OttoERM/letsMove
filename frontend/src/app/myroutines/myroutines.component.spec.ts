import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyroutinesComponent } from './myroutines.component';

describe('MyroutinesComponent', () => {
  let component: MyroutinesComponent;
  let fixture: ComponentFixture<MyroutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyroutinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyroutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
