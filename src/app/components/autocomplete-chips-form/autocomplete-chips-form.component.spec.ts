import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteChipsFormComponent } from './autocomplete-chips-form.component';

describe('AutocompleteChipsFormComponent', () => {
  let component: AutocompleteChipsFormComponent;
  let fixture: ComponentFixture<AutocompleteChipsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteChipsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteChipsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
