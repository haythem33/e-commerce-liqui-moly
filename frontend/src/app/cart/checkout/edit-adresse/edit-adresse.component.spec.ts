import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdresseComponent } from './edit-adresse.component';

describe('EditAdresseComponent', () => {
  let component: EditAdresseComponent;
  let fixture: ComponentFixture<EditAdresseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdresseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
