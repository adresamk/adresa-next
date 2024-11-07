export const northMacedonia = {
  municipalities: [
    {
      id: "1",
      cities: [
        "11", // City ID for Skopje
      ],
      villages: [],
    },
    {
      id: "2",
      cities: [
        "21", // City ID for Bitola
      ],
      villages: [
        "201", // Village ID for Radožda
        "202", // Village ID for Nizhepole
        "203", // Village ID for Trnovo
      ],
    },
    {
      id: "3",
      cities: [
        "31", // City ID for Ohrid
      ],
      villages: [
        "204", // Village ID for Radožda
        "205", // Village ID for Lagadin
        "206", // Village ID for Gorenci
      ],
    },
    {
      id: "4",
      cities: [
        "41", // City ID for Tetovo
      ],
      villages: [
        "207", // Village ID for Jezersko
        "208", // Village ID for Drenovec
        "209", // Village ID for Gajre
      ],
    },
    {
      id: "5",
      cities: [
        "51", // City ID for Kumanovo
      ],
      villages: [
        "210", // Village ID for Staro Nagoričane
        "211", // Village ID for Vataša
        "212", // Village ID for Banjica
      ],
    },
    // Add more municipalities as needed
  ],
};

// Labels for different languages
export const labels = {
  en: {
    municipalities: {
      "1": "Skopje",
      "2": "Bitola",
      "3": "Ohrid",
      "4": "Tetovo",
      "5": "Kumanovo",
    },
    cities: {
      "11": "Skopje",
      "21": "Bitola",
      "31": "Ohrid",
      "41": "Tetovo",
      "51": "Kumanovo",
    },
    villages: {
      "201": "Radožda",
      "202": "Nizhepole",
      "203": "Trnovo",
      "204": "Radožda",
      "205": "Lagadin",
      "206": "Gorenci",
      "207": "Jezersko",
      "208": "Drenovec",
      "209": "Gajre",
      "210": "Staro Nagoričane",
      "211": "Vataša",
      "212": "Banjica",
    },
  },
  mk: {
    municipalities: {
      "1": "Скопје",
      "2": "Битола",
      "3": "Охрид",
      "4": "Тетово",
      "5": "Куманово",
    },
    cities: {
      "11": "Скопје",
      "21": "Битола",
      "31": "Охрид",
      "41": "Тетово",
      "51": "Куманово",
    },
    villages: {
      "201": "Радожда",
      "202": "Нижеполе",
      "203": "Трново",
      "204": "Радожда",
      "205": "Лагадин",
      "206": "Горенци",
      "207": "Езеро",
      "208": "Дреновец",
      "209": "Гајре",
      "210": "Старо Нагоричане",
      "211": "Ваташа",
      "212": "Бањица",
    },
  },
  // Add more languages as needed
};

// Export the objects for use in other parts of the application
export default northMacedonia;
