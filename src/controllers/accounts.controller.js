import Account from "../models/Account.js";

export const createAccount = async (req, res) => {
  const { type } = req.body;
  const userId = req.user.userId;

  try {
    const accountType = type || "SAVINGS";

    const count = await Account.countDocuments({
      user: userId,
      type: accountType,
    });
    if (accountType === "SAVINGS" && count >= 3) {
      return res.status(400).json({ message: "Savings account limit reached" });
    }
    if (accountType === "CURRENT" && count >= 1) {
      return res.status(400).json({ message: "Current account limit reached" });
    }

    const account = new Account({
      user: userId,
      type: accountType,
    });
    await account.save();

    return res.status(201).json({
      message: "Account created successfully",
      account: {
        id: account._id,
        accountNumber: account.accountNumber,
        type: account.type,
        balance: account.balance,
        createdAt: account.createdAt,
      },
    });
  } catch (error) {
    console.error("Create account error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

