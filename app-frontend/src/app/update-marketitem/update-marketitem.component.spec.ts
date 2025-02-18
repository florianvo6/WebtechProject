import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMarketitemComponent } from './update-marketitem.component';

describe('UpdateMarketitemComponent', () => {
  let component: UpdateMarketitemComponent;
  let fixture: ComponentFixture<UpdateMarketitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMarketitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMarketitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
