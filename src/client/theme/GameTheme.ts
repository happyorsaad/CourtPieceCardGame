export namespace Theme {
  export const Colors = {
    BACKGROUND: 0x006a4e,
    RED: 0xc83f3e,
    RED_S: "#c83f3e",
    BLUE: 0x4485bf,
    BLUE_S: "#4485bf",
    WHITE: 0x000000,
    AMBIENT_LIGHT: 0x333333,
    SHADOW_COLOR: 0x222222,
    CARD_TINT: 0xb2b1b9,
    PROGRESS_BAR_TRACKING: 0x303841,
    PROGRESS_BAR_TEXT: 0xe4f9f5,
    CHAT_BACKGROUND: 0xf9f7f7,
  };

  export const TextStyles = {
    SCORE_TEXT: {
      align: "center",
      fontSize: "25px",
      padding: {
        x: 5,
        y: 5,
      },
      shadow: {
        offsetX: 2,
        fill: true,
      },
    },

    BANNER_TEXT: {
      align: "center",
      fontFamily: "s",
      fontSize: "100px",
      fontStyle: "bold",
      shadow: {
        offsetX: 2,
        fill: true,
      },
    },

    LABEL_TEXT_LARGE: {
      align: "center",
      fontSize: "20px",
      color: "#ffffff",
      shadow: {
        offsetX: 2,
        fill: true,
      },
    },

    LABEL_TEXT_SMALL: {
      align: "center",
      fontSize: "15px",
      color: "#ffffff",
      shadow: {
        offsetX: 1,
        fill: true,
      },
    },

    INPUT_TEXT: {
      type: "text",
      fontSize: "20px",
      align: "center",
      backgroundColor: "#fff",
      color: "#000",
      padding: {
        x: 2,
        y: 10,
      },
    },

    INPUT_TEXT_CHAT: {
      type: "text",
      fontSize: "20px",
      align: "left",
      backgroundColor: "#fff",
      color: "#000",
      padding: {
        x: 2,
        y: 10,
      },
    },

    ERROR_TEXT: {
      fontSize: "20px",
    },

    TEXT_BUTTON: {
      align: "center",
      backgroundColor: "#000000",
      color: "#FFFFFF",
      fontSize: "20px",
      padding: {
        x: 5,
        y: 15,
      },
      shadow: {
        offsetX: 1,
        fill: true,
      },
    },
  };
}
