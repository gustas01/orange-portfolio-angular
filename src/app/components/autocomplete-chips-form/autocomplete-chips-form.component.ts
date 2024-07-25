import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  model,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TagType } from 'app/types/tag-type';

@Component({
  selector: 'app-autocomplete-chips-form',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule],
  templateUrl: './autocomplete-chips-form.component.html',
  styleUrl: './autocomplete-chips-form.component.scss',
})
export class AutocompleteChipsFormComponent {
  @Input({ required: true }) tags = signal<TagType[]>([]);
  @Output() tagsEmitter = new EventEmitter<WritableSignal<string[]>>();
  @Input() filteredTags = signal<string[]>([]);
  availableTags = computed(() =>
    this.tags()
      .map((t) => t.tagName)
      .filter((tagName) => !this.filteredTags().includes(tagName))
  );

  constructor() {}

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');

  remove(tag: string): void {
    this.filteredTags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      return [...tags];
    });
    this.tagsEmitter.emit(this.filteredTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filteredTags.update((tags) => [...tags, event.option.viewValue]);
    this.currentTag.set('');
    event.option.deselect();

    //TODO: fazer output mandando esse filteredTags para a Home
    this.tagsEmitter.emit(this.filteredTags);
  }
}
