import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatefieldComponent } from './datefield.component';

describe('DatefieldComponent', () => {
  let component: DatefieldComponent;
  let fixture: ComponentFixture<DatefieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatefieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
