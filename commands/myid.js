const description = `No prompt.
Just send /myid`;

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (prompt) {
      return sendMessage(senderId, { text: "❌ This command does not require any additional input." });
    }

    try {
      await sendMessage(senderId, { text: `Your sender ID is: ${senderId}` });
    } catch (error) {
      console.error("Error retrieving sender ID:", error.message);
      sendMessage(senderId, { text: "❌ An error occurred while retrieving the sender ID." });
    }
  }
};
