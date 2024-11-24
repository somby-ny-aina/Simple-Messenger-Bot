module.exports = {
  description: "Executes JavaScript code (Admin only).",
  adminId: "6881956545251284",

  execute: async (args, senderId, sendMessage) => {
    if (senderId !== module.exports.adminId) {
      return await sendMessage(senderId, { text: "❌ You are not authorized to use this command." });
    }

    try {
      const code = args.trim();
      if (!code) {
        return await sendMessage(senderId, { text: "❌ No code provided to evaluate." });
      }

      let result = eval(code);

      if (result instanceof Promise) {
        result = await result;
      }

      await sendMessage(senderId, { text: `✅ Result:\n${result}` });
    } catch (error) {
      await sendMessage(senderId, { text: `❌ Error:\n${error.message}` });
    }
  }
};