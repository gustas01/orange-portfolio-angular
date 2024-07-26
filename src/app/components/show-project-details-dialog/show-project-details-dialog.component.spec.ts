import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProjectDetailsDialogComponent } from './show-project-details-dialog.component';

describe('ShowProjectDetailsDialogComponent', () => {
  let component: ShowProjectDetailsDialogComponent;
  let fixture: ComponentFixture<ShowProjectDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProjectDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProjectDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
