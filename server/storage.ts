import { User, InsertUser, Transaction } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTransaction(senderId: number, receiverUsername: string, amount: number): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  updateUserBalance(userId: number, amount: number): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  currentId: number;
  currentTransactionId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.currentId = 1;
    this.currentTransactionId = 1;
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, balance: 10000000 };
    this.users.set(id, user);
    return user;
  }

  async createTransaction(senderId: number, receiverUsername: string, amount: number): Promise<Transaction> {
    const receiver = await this.getUserByUsername(receiverUsername);
    if (!receiver) throw new Error("Receiver not found");

    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      id,
      senderId,
      receiverId: receiver.id,
      amount,
      status: "completed",
      createdAt: new Date(),
    };

    this.transactions.set(id, transaction);
    
    // Update balances
    const sender = await this.getUser(senderId);
    if (!sender) throw new Error("Sender not found");
    
    if (sender.balance < amount) throw new Error("Insufficient funds");
    
    await this.updateUserBalance(senderId, sender.balance - amount);
    await this.updateUserBalance(receiver.id, receiver.balance + amount);

    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.senderId === userId || t.receiverId === userId
    );
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    this.users.set(userId, { ...user, balance: newBalance });
  }
}

export const storage = new MemStorage();
