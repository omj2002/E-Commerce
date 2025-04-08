import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeKitchenComponent } from './home-kitchen.component';

describe('HomeKitchenComponent', () => {
  let component: HomeKitchenComponent;
  let fixture: ComponentFixture<HomeKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeKitchenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
