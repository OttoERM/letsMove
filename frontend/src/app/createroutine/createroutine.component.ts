import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import exercise from '../services/workouts/exercise';
import { WorkoutsService } from '../services/workouts/workouts.service';
import { SessionStorageService } from '../services/sessionStorage/session-storage.service';
import workout from '../services/workouts/workout';

interface exercises extends exercise {
  id?: number;
}

@Component({
  selector: 'app-createroutine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createroutine.component.html',
  styleUrl: './createroutine.component.css',
})
export class CreateroutineComponent {
  workoutsService = inject(WorkoutsService);
  sessionStorageService = inject(SessionStorageService);

  exerciseIndex = 0;
  exercises: exercises[] = [
    {
      id: 0,
      activity: '',
      directions: '',
    },
  ];
  activityInput = new FormControl(this.exercises[this.exerciseIndex].activity);
  directionsInput = new FormControl(
    this.exercises[this.exerciseIndex].directions
  );
  tagsInput = new FormControl('');

  constructor(private fb: FormBuilder) {}
  workoutForm = this.fb.group({
    title: '',
    description: '',
    author: '',
    tags: new FormControl<string[]>(['Facil']),
    exercises: this.fb.array<exercise>([]),
  });

  setActivity() {
    this.exercises[this.exerciseIndex].activity = this.activityInput.value
      ? this.activityInput.value
      : '';
  }

  setDirection() {
    this.exercises[this.exerciseIndex].directions = this.directionsInput.value
      ? this.directionsInput.value
      : '';
  }

  incrementIndex() {
    if (this.exerciseIndex < this.exercises.length - 1) {
      this.exerciseIndex++;
      this.updateInputFields();
    }
  }

  decrementIndex() {
    if (this.exerciseIndex > 0) {
      this.exerciseIndex--;
      this.updateInputFields();
    }
  }

  updateInputFields() {
    this.activityInput.setValue(this.exercises[this.exerciseIndex].activity);
    this.directionsInput.setValue(
      this.exercises[this.exerciseIndex].directions
    );
  }

  createEmptyExercise() {
    this.exercises.push({
      id: this.exercises.length,
      activity: '',
      directions: '',
    });
    this.exerciseIndex++;
    this.updateInputFields();
  }

  editSelected(index: number | undefined) {
    if (index || index == 0) {
      this.exerciseIndex = index;
      this.updateInputFields();
    }
  }

  save() {
    this.workoutForm.controls.tags.setValue(
      this.tagsInput.value ? this.tagsInput.value.split(' ') : []
    );
    this.exercises.forEach((exercise) => {
      this.workoutForm.controls.exercises.insert(
        this.workoutForm.controls.exercises.length,
        new FormControl({
          activity: exercise.activity,
          directions: exercise.directions,
        })
      );
    });
    const trainerId = this.sessionStorageService.getItem('id');
    if (trainerId) this.workoutForm.controls.author.setValue(trainerId);
    else throw new Error('Could not find trainer Id');

    this.workoutsService.postWorkout(this.workoutForm.value).subscribe();
  }

  drop() {
    this.workoutForm.reset();
    this.workoutForm.controls.exercises.clear();
    this.activityInput.reset();
    this.directionsInput.reset();
    this.exerciseIndex = 0;
    this.exercises = [
      {
        id: 0,
        activity: '',
        directions: '',
      },
    ];
    this.setActivity();
    this.setDirection();
    this.tagsInput.reset();
  }
}
