export type FirebaseTaskDocument = {
  id: string;
  title: string;
};

export type FirebaseUserDocument = {
  id: string;
  name: string;
  taskStatuses: { id: string; status: string }[];
};

export type UserWithTasks = {
  id: string;
  name: string;
  tasks: { id: string; title: string; status: string }[];
};
