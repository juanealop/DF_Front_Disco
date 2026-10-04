import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorComponent } from './advisor.component';

describe('AdvisorComponent', () => {
  let component: AdvisorComponent;
  let fixture: ComponentFixture<AdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
