import express from "express";

const router = express.Router();

router.post("/agent-action", (req, res) => {
  const { action } = req.body || {};

  // Case 1: invalid payload (no action provided or empty object)
  if (!action) {
    return res.status(400).json({
      status: "error",
      message: "Invalid payload"
    });
  }

  // Case 2: supported actions
  if (action === "submit") {
    return res.json({
      status: "success",
      message: "Agent data submitted successfully"
    });
  }

  if (action === "verify") {
    return res.json({
      status: "success",
      message: "Agent documents verified successfully"
    });
  }

  // Case 3: unknown action
  return res.status(400).json({
    status: "error",
    message: "Unknown action"
  });
});

export default router;