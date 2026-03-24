import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterDashboardComponent } from './transporter-home';

describe('TransporterDashboardComponent', () => {
  let component: TransporterDashboardComponent;
  let fixture: ComponentFixture<TransporterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransporterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporterDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
