"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { collection, getDocs, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TestFirebasePage() {
  const [status, setStatus] = useState<string>("Loading...");
  const [user, setUser] = useState<any>(null);
  const [recordings, setRecordings] = useState<any[]>([]);

  useEffect(() => {
    console.log("🔥 TEST: Testing Firebase configuration...");

    // Test Firebase app configuration
    console.log("🔥 TEST: Firebase app config:", {
      projectId: db.app.options.projectId,
      authDomain: db.app.options.authDomain,
    });

    // Test authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 TEST: Auth state changed:", user ? user.uid : "No user");
      setUser(user);
      setStatus(user ? "Authenticated" : "Not authenticated");
    });

    return unsubscribe;
  }, []);

  const testFirestore = async () => {
    try {
      console.log("🔥 TEST: Testing Firestore connection...");
      const testCollection = collection(db, "recordings");
      const testQuery = getDocs(testCollection);
      const snapshot = await testQuery;
      console.log(
        "🔥 TEST: Firestore test successful, got",
        snapshot.docs.length,
        "documents"
      );
      setRecordings(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setStatus("Firestore working");
    } catch (error) {
      console.error("🔥 TEST: Firestore test failed:", error);
      setStatus(
        "Firestore failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const testAPI = async () => {
    try {
      console.log("🔥 TEST: Testing API connection...");
      const response = await fetch("/api/recordings");
      console.log("🔥 TEST: API response status:", response.status);
      const data = await response.text();
      console.log("🔥 TEST: API response:", data);
      setStatus("API test completed");
    } catch (error) {
      console.error("🔥 TEST: API test failed:", error);
      setStatus(
        "API failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Firebase Test Page</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Status: {status}</h2>
        {user && (
          <div>
            <p>User: {user.uid}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={testFirestore} style={{ marginRight: "10px" }}>
          Test Firestore
        </button>
        <button onClick={testAPI}>Test API</button>
      </div>

      {recordings.length > 0 && (
        <div>
          <h3>Recordings in database:</h3>
          <ul>
            {recordings.map((recording, index) => (
              <li key={index}>
                {recording.title || recording.id} - {recording.userId}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
}
