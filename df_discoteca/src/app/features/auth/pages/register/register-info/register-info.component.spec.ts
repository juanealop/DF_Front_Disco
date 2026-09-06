import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInfoComponent } from './register-info.component';

describe('RegisterInfoComponent', () => {
  let component: RegisterInfoComponent;
  let fixture: ComponentFixture<RegisterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
