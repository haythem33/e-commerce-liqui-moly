import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingInformationComponent } from './missing-information.component';

describe('MissingInformationComponent', () => {
  let component: MissingInformationComponent;
  let fixture: ComponentFixture<MissingInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
