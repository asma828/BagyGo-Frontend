import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRequests } from './browse-requests';

describe('BrowseRequests', () => {
  let component: BrowseRequests;
  let fixture: ComponentFixture<BrowseRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
