import React from "react";

export default function CrashScreen() {
  // Lança um erro intencional para testar o Error Boundary
  throw new Error("Crash intencional para testar Error Boundary");
  
  return null;
}