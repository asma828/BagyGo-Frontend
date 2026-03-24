import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCardComponent } from './offer-card';

describe('OfferCardComponent', () => {
  let component: OfferCardComponent;
  let fixture: ComponentFixture<OfferCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
