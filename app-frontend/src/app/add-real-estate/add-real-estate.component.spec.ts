import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRealEstateComponent } from './add-real-estate.component';

describe('AddRealEstateComponent', () => {
  let component: AddRealEstateComponent;
  let fixture: ComponentFixture<AddRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRealEstateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
