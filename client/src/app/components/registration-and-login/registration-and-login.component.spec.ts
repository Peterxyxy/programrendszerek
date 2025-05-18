import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAndLoginComponent } from './registration-and-login.component';

describe('RegistrationAndLoginComponent', () => {
  let component: RegistrationAndLoginComponent;
  let fixture: ComponentFixture<RegistrationAndLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationAndLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationAndLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
