import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchroutinesComponent } from './searchroutines.component';

describe('SearchroutinesComponent', () => {
  let component: SearchroutinesComponent;
  let fixture: ComponentFixture<SearchroutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchroutinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchroutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
