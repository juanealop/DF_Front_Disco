import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSedeComponent } from './ver-sede.component';

describe('VerSedeComponent', () => {
  let component: VerSedeComponent;
  let fixture: ComponentFixture<VerSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSedeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
