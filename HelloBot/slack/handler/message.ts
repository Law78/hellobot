export const waveMessage = async ({ message, say }) => {
    await say({
      "blocks": [
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": ":white_check_mark: Valid",
              },
              "style": "primary",
              "action_id": "action_a",
              "value": "click_me_123",
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": ":x: Invalid",
              },
              "style": "danger",
              "action_id": "action_b",
              "value": "click_me_123",
            },
          ],
        }
      ]
    });
  }