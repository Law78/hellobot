export const waveMessage = async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Please validate the previous message:",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":white_check_mark: Valid",
            },
            style: "primary",
            action_id: "mark_message_valid",
            value: "valid",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":x: Invalid",
            },
            style: "danger",
            action_id: "mark_message_invalid",
            value: "invalid",
          },
        ],
      },
    ],
  });
};
