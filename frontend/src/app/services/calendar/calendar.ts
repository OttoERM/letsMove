interface scheduledExercise {
  workout: string;
  time: string;
}

interface calendar {
  _id?: string;
  calendar: {
    su: scheduledExercise[];
    mo: scheduledExercise[];
    tu: scheduledExercise[];
    we: scheduledExercise[];
    th: scheduledExercise[];
    fr: scheduledExercise[];
    sa: scheduledExercise[];
  };
}

export { calendar, scheduledExercise };
