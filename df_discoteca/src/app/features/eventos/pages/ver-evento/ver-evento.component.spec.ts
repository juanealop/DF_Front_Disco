import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEventoComponent } from './ver-evento.component';

describe('VerEventoComponent', () => {
  let component: VerEventoComponent;
  let fixture: ComponentFixture<VerEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
