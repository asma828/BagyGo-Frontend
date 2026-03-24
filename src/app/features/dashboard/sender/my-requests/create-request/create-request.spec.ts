import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestComponent } from './create-request';

describe('CreateRequestComponent', () => {
  let component: CreateRequestComponent;
  let fixture: ComponentFixture<CreateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
