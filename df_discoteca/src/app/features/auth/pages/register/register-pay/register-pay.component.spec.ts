import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPayComponent } from './register-pay.component';

describe('RegisterPayComponent', () => {
  let component: RegisterPayComponent;
  let fixture: ComponentFixture<RegisterPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
