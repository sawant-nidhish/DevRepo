import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgModalComponent } from './ng-modal.component';

describe('NgModalComponent', () => {
  let component: NgModalComponent;
  let fixture: ComponentFixture<NgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
