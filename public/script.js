document.addEventListener('DOMContentLoaded', () => {
  const optionsButtons = document.querySelectorAll(".option-button");
  const advancedOptionButton = document.querySelectorAll(".adv-option-button");
  const fontName = document.getElementById("fontName");
  const fontSizeRef = document.getElementById("fontSize");
  const writingArea = document.getElementById("text-input");
  const linkButton = document.getElementById("createLink");
  const alignButtons = document.querySelectorAll(".align");
  const spacingButtons = document.querySelectorAll(".spacing");
  const formatButtons = document.querySelectorAll(".format");
  const scriptButtons = document.querySelectorAll(".script");
  const saveButton = document.getElementById("save");
  const saveToDBButton = document.getElementById("saveButton"); // Get Save to DB button

  // List of fonts
  const fontList = [
    "Arial", "Verdana", "Times New Roman", "Garamond",
    "Georgia", "Courier New", "cursive"
  ];

  // Initial setup
  const initializer = () => {
    // Add font options
    fontList.forEach(font => {
      const option = document.createElement("option");
      option.value = font;
      option.innerText = font;
      fontName.appendChild(option);
    });

    // Add font sizes
    for (let i = 1; i <= 7; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.innerText = i;
      fontSizeRef.appendChild(option);
    }

    fontSizeRef.value = 3;

    // Highlight options
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);
  };

  // Save content as file
  const saveTextAsFile = () => {
    const fileType = prompt("Enter file type (html or txt):", "txt");

    // Get content from editor
    const textToWrite = writingArea.innerText;
    let fileNameToSaveAs;
    let textFileAsBlob;

    // Create Blob based on file type
    if (fileType === 'html') {
      const htmlContent = writingArea.innerHTML;
      textFileAsBlob = new Blob([htmlContent], { type: 'text/html' });
      fileNameToSaveAs = 'text_editor_content.html';
    } else if (fileType === 'txt') {
      textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
      fileNameToSaveAs = 'text_editor_content.txt';
    } else {
      alert("Invalid file type! Please enter 'html' or 'txt'.");
      return;
    }

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.click();
  };

  // Attach save function to button
  saveButton.addEventListener("click", saveTextAsFile);

  // Save content to database
  saveToDBButton.addEventListener("click", () => {
    const content = writingArea.innerHTML; // or use innerText based on your needs

    // Send POST request to server
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Content saved to DB successfully');
      // Optionally handle response if needed
    })
    .catch(error => {
      console.error('Error saving content to DB:', error);
      // Handle error
    });
  });

  // Modify text using execCommand
  const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
  };

  // Basic operation buttons
  optionsButtons.forEach(button => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
    });
  });

  // Advanced options with value parameter
  advancedOptionButton.forEach(button => {
    button.addEventListener("change", () => {
      modifyText(button.id, false, button.value);
    });
  });

  // Link creation
  linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL");
    if (!/http/i.test(userLink)) {
      userLink = "http://" + userLink;
    }
    modifyText(linkButton.id, false, userLink);
  });

  // Highlight buttons
  const highlighter = (className, needsRemoval) => {
    className.forEach(button => {
      button.addEventListener("click", () => {
        if (needsRemoval) {
          let alreadyActive = button.classList.contains("active");
          highlighterRemover(className);
          if (!alreadyActive) {
            button.classList.add("active");
          }
        } else {
          button.classList.toggle("active");
        }
      });
    });
  };

  const highlighterRemover = (className) => {
    className.forEach(button => {
      button.classList.remove("active");
    });
  };

  // Initialize on load
  initializer();
});
