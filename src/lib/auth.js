import jwt from "jsonwebtoken";

export function verifyAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return { id: decoded.id }; // always return { id: userId }
  } catch (err) {
    throw new Error("Unauthorized");
  }
}
