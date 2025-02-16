import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { transferSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// Simple ML fraud detection simulation
function simulateFraudDetection(faceImage?: string, amount: number) {
  // In a real implementation, this would:
  // 1. Use actual ML models to analyze the face image
  // 2. Check transaction patterns
  // 3. Verify SSL certificate chain
  // 4. Check for known fraud indicators

  const fraudScore = Math.random() * 100; // Simulate fraud score 0-100
  const highRiskAmount = amount > 500000; // Extra scrutiny for very high amounts

  return {
    fraudScore,
    riskLevel: fraudScore > 70 ? "high" : highRiskAmount ? "medium" : "low",
    verified: fraudScore <= 70 && (!highRiskAmount || faceImage)
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getUserTransactions(req.user.id);
    res.json(transactions);
  });

  app.post("/api/transfer", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parseResult = transferSchema.safeParse(req.body.transfer);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const { amount } = parseResult.data;

    // For high-value transactions, verify security checks
    if (amount >= 100000) {
      const verification = req.body.verification;
      if (!verification?.biometricVerified) {
        return res.status(400).json({ message: "Biometric verification required for high-value transfers" });
      }

      // Simulate ML-based fraud detection
      const fraudDetection = simulateFraudDetection(verification.faceImage, amount);
      if (!fraudDetection.verified) {
        return res.status(400).json({ 
          message: "Transaction blocked due to security concerns",
          fraudScore: fraudDetection.fraudScore,
          riskLevel: fraudDetection.riskLevel
        });
      }
    }

    try {
      const transaction = await storage.createTransaction(
        req.user.id,
        parseResult.data.receiverUsername,
        parseResult.data.amount
      );
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}