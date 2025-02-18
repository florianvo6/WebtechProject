import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChatComponent } from './detail-chat.component';

describe('DetailChatComponent', () => {
  let component: DetailChatComponent;
  let fixture: ComponentFixture<DetailChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
