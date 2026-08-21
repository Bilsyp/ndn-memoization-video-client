export const configurePlayer = {
  streaming: {
    bufferingGoal: 30, // Memberikan ruang 10 detik (dari detik 20 ke 30) untuk BBA stabil di max bitrate
    rebufferingGoal: 5, // Menyesuaikan dengan RESERVOIR baru agar konsisten
    bufferBehind: 30,
  },
};
export const experiment_configure = {
  ABR: "",
  Scenario: "",
  Memo: "",
};
