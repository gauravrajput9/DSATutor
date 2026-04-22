export const checkAuth = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
      method: "POST"
    });

    return res.ok; // true or false
  } catch (error) {
    return false;
  }
};