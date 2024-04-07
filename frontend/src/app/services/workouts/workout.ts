import exercise from './exercise';

interface workout {
  _id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  createdAt: string;
  exercises: exercise[];
  authorInfo?: Array<{
    _id: string;
    username: string;
  }>;
}

export default workout;
