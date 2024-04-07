interface login {
  username: string;
  password: string;
}

interface signin extends login {
  role: string;
}

export { login, signin };
