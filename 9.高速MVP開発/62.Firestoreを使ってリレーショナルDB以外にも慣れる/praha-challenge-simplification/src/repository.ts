import * as admin from "firebase-admin";
import { FirebaseTaskDocument, FirebaseUserDocument } from "./types";

class Repository {
  private readonly firestore: FirebaseFirestore.Firestore;

  public constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(
        require("../praha-challenge-4da00-firebase-adminsdk-62lrg-38ecec40b8.json")
      ),
    });
    this.firestore = admin.firestore();
  }

  public async getTasks(): Promise<FirebaseTaskDocument[]> {
    const taskCollection = await this.firestore.collection("tasks").get();

    return taskCollection.docs.map((taskDocument) => {
      const documentData = taskDocument.data() as {
        title: string;
      };
      return {
        id: taskDocument.id,
        ...documentData,
      };
    });
  }

  public async getUsers(): Promise<FirebaseUserDocument[]> {
    const userCollection = await this.firestore.collection("users").get();

    return await Promise.all(
      userCollection.docs.map(async (userDocument) => {
        const documentData = userDocument.data() as { name: string };
        const userTaskStatuses = await this.getTaskStatuses(userDocument);
        // console.log(userTaskStatuses);

        return {
          id: userDocument.id,
          ...documentData,
          taskStatuses: userTaskStatuses,
        };
      })
    );
  }

  public async updateTaskToComplete(
    userId: string,
    taskId: string
  ): Promise<void> {
    const user = await this.firestore.collection("users").doc(userId).get();

    const taskStatusRef = user.ref.collection("task-statuses").doc(taskId);
    await taskStatusRef.update({
      status: "完了",
    });
  }

  public async updateTask(updateTask: FirebaseTaskDocument): Promise<void> {
    const taskRef = this.firestore.collection("tasks").doc(updateTask.id);
    await taskRef.update({
      title: updateTask.title,
    });
  }

  public async deleteTask(id: string): Promise<void> {
    const batch = this.firestore.batch();

    const taskRef = this.firestore.collection("tasks").doc(id);
    const usersCollection = await this.firestore.collection("users").get();
    usersCollection.forEach((userDocument) => {
      batch.delete(userDocument.ref.collection("task-statuses").doc(id));
    });
    batch.delete(taskRef);

    batch.commit();
  }

  private async getTaskStatuses(
    userDocument: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  ): Promise<{ id: string; status: string }[]> {
    const taskStatusesCollection = await userDocument.ref
      .collection("task-statuses")
      .get();
    // console.log(taskStatusesCollection.docs);

    return taskStatusesCollection.docs.map((taskStatusDocument) => {
      const taskStatusData = taskStatusDocument.data() as { status: string };
      return { id: taskStatusDocument.id, ...taskStatusData };
    });
  }
}

export default new Repository();
