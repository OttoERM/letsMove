interface user {
  _id: string;
  username: string;
  // author: string;
  role: string;
  calendarId?: string;
  workoutsIds?: string[];
}

export default user;
