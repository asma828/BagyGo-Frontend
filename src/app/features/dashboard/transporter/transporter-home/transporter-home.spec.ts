import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterHome } from './transporter-home';

describe('TransporterHome', () => {
  let component: TransporterHome;
  let fixture: ComponentFixture<TransporterHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransporterHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporterHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
