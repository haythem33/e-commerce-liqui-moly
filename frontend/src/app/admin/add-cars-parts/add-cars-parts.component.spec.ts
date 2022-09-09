import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarsPartsComponent } from './add-cars-parts.component';

describe('AddCarsPartsComponent', () => {
  let component: AddCarsPartsComponent;
  let fixture: ComponentFixture<AddCarsPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarsPartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarsPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
