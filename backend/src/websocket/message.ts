interface message {
  _id: string;
  emisor: string;
  receiver: string;
  fromId: string;
  toId: string;
  message: string;
}

export default message;
