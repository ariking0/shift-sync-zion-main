
import { Position } from "@/types";

// קביעת העמדות והשעות הקבועות שלהן
export const positions: Position[] = [
  {
    name: "הולכי רגל",
    backgroundColor: "#90caf9", // כחול בהיר
  },
  {
    name: "רכבים",
    backgroundColor: "#90caf9", // כחול בהיר
  },
  {
    name: "סייר",
    startTime: "5:45",
    endTime: "14:00",
    backgroundColor: "#ffcdd2", // ורוד בהיר
  },
  {
    name: "צ\"פים",
    backgroundColor: "#90caf9", // כחול בהיר
  },
  {
    name: "מרפאות",
    backgroundColor: "#80deea", // טורקיז בהיר
  },
  {
    name: "מתגבר מרפאות",
    backgroundColor: "#80deea", // טורקיז בהיר
  },
  {
    name: "ציפה",
    backgroundColor: "#80deea", // טורקיז בהיר
  },
  {
    name: "שער עליון",
    startTime: "14:00",
    backgroundColor: "#fff59d", // צהוב בהיר
  },
  {
    name: "מיון בוקר",
    backgroundColor: "#c8e6c9", // ירוק בהיר
  },
  {
    name: "מוקד בוקר",
    startTime: "5:45",
    endTime: "14:00",
    backgroundColor: "#a5d6a7", // ירוק בהיר
  },
  {
    name: "עמדת מחליף",
    startTime: "9:45",
    endTime: "19:00",
    backgroundColor: "#80deea", // טורקיז בהיר
  },
  {
    name: "מוקד צהריים",
    startTime: "13:45",
    endTime: "22:00",
    backgroundColor: "#a5d6a7", // ירוק בהיר
  },
  {
    name: "מיון צהריים",
    backgroundColor: "#80deea", // טורקיז בהיר
  },
  {
    name: "שער עליון לילה",
    startTime: "13:45",
    endTime: "22:00",
    backgroundColor: "#fff59d", // צהוב בהיר
  },
  {
    name: "מוקד לילה",
    startTime: "21:45",
    endTime: "6:00",
    backgroundColor: "#a5d6a7", // ירוק בהיר
  }
];
