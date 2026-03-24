import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRequestsComponent } from './browse-requests';

describe('BrowseRequestsComponent', () => {
  let component: BrowseRequestsComponent;
  let fixture: ComponentFixture<BrowseRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
