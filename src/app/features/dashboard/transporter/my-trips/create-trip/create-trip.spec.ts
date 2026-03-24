import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripComponent } from './create-trip';

describe('CreateTripComponent', () => {
  let component: CreateTripComponent;
  let fixture: ComponentFixture<CreateTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTripComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
