import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { RegisterPayComponent } from './register-pay.component';

describe('RegisterPayComponent', () => {
  let component: RegisterPayComponent;
  let fixture: ComponentFixture<RegisterPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPayComponent],
      providers: [provideRouter([]), provideHttpClient()]
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
