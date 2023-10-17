document.addEventListener("DOMContentLoaded", function () {
    const generationForm = document.getElementById("generationForm");
    const promptInput = document.getElementById("prompt");
    const audioFile = document.getElementById("audioFile");

    generationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const prompt = promptInput.value;
        if (prompt) {
            const response = await generateAudio(prompt);
            if (response && response.audioUrl) {
                audioPlayer.src = response.audioUrl;
                audioPlayer.play();
            }
        }
    });

    async function generateAudio(prompt) {
        try {
          const audioFileInput = document.getElementById("audioFile");
          const audioFile = audioFileInput.files[0];
      
          const formData = new FormData();
          formData.append("prompt", prompt);
          formData.append("audioFile", audioFile);
      
          const response = await fetch("/generate-audio", {
            method: "POST",
            body: formData, // Send the form data including the audio file
          });
      
          return response.json();
        } catch (error) {
          console.error("Error generating audio:", error);
        }
      }
      
});
