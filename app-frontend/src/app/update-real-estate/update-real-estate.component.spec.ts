import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRealEstateComponent } from './update-real-estate.component';

describe('UpdateRealEstateComponent', () => {
  let component: UpdateRealEstateComponent;
  let fixture: ComponentFixture<UpdateRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRealEstateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
