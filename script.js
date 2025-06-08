function autoSubmitResponsesToForm() {
  var formId = "ENTER_YOU_FORM_ID";
  var formUrl = "https://docs.google.com/forms/d/e/" + formId + "/formResponse";

 
  var numberOfSubmissionsPerRun = 20; // For example, 5 submissions per run.
  // Set a random delay between submissions to mimic human behavior and avoid potential issues.
  var minDelaySeconds = 2; // Minimum delay in seconds.
  var maxDelaySeconds = 5; // Maximum delay in seconds.

  // --- Data Options for Your Form Questions ---
  // IMPORTANT: These values MUST EXACTLY match the options/values as they appear in your Google Form!
  // Only Galle, Colombo, and Mathara are included as per your request.
  var cityOptions = ["Galle", "Colombo" , "Mathara"];
  // Gender options remain as previously confirmed.
  var genderOptions = ["Male", "Female"];
  // Only < 20, 21-25, and 26-30 are included as per your request.
  var ageOptions = ["10", "20", "30" , "40"];

  Logger.log("Starting automated submissions to Form ID: " + formId);

  for (var i = 0; i < numberOfSubmissionsPerRun; i++) {
    // Construct the payload with the correct entry IDs and randomly selected data.
    var submissionData = {
      // City/Location Field (ID: entry.1781203747)
      "entry.1781203747": getRandomArrayElement(cityOptions),

      // Gender Field (ID: entry.1873596365)
      "entry.1873596365": getRandomArrayElement(genderOptions),

      // Age Group/Range Field (ID: entry.1961800496)
      "entry.1961800496": getRandomArrayElement(ageOptions)
    };

    var options = {
      "method": "post",
      "payload": submissionData,
      "muteHttpExceptions": true // This helps in debugging by allowing us to see error responses.
    };

    try {
      Logger.log("Attempting submission " + (i + 1) + " with data: " + JSON.stringify(submissionData));
      var response = UrlFetchApp.fetch(formUrl, options);

      if (response.getResponseCode() == 200) {
        Logger.log("Submission " + (i + 1) + " successful! Status: 200 OK.");
      } else {
        Logger.log("Submission " + (i + 1) + " failed! Status Code: " + response.getResponseCode());
        // If there's an error (e.g., 400 Bad Request), this will print the HTML content of Google Forms' error page for clues.
        Logger.log("Response Text: " + response.getContentText());
      }
    } catch (e) {
      Logger.log("An error occurred during submission " + (i + 1) + ": " + e.message);
    }

    // Apply a random delay before the next submission, unless it's the very last one in this run.
    if (i < numberOfSubmissionsPerRun - 1) {
      var delayMs = (Math.random() * (maxDelaySeconds - minDelaySeconds) + minDelaySeconds) * 1000;
      Logger.log("Waiting for " + (delayMs / 1000).toFixed(2) + " seconds before next submission...");
      Utilities.sleep(delayMs);
    }
  }
  Logger.log("Finished " + numberOfSubmissionsPerRun + " automated submissions for this run.");
}

// --- Helper Functions ---

// This function simply returns a random element from any given array.
function getRandomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setupAutoSubmitTrigger() {
  // First, delete any existing triggers for this specific function to prevent duplicates.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "autoSubmitResponsesToForm") {
      ScriptApp.deleteTrigger(triggers[i]);
      Logger.log("Deleted existing trigger for autoSubmitResponsesToForm to prevent duplicates.");
    }
  }

  // Now, create a new time-driven trigger.
  // You can adjust the frequency to suit your needs.
  ScriptApp.newTrigger('autoSubmitResponsesToForm')
      .timeBased()
      // Uncomment ONE of the following lines to set the frequency:
      // .everyMinutes(5)  // Runs every 5 minutes (useful for initial testing).
      // .everyHours(1)   // Runs every hour.
      .everyDays(1)    // Runs once every day (a common choice for research/simulations).
      // If you want it to run at a specific time each day (e.g., 9 PM Singapore time), combine .everyDays(1) with .atHour(21).
      // .atHour(21) // Current time in Singapore is 8:25 PM, so 21 is 9 PM.
      .create();

  Logger.log("New time-driven trigger for autoSubmitResponsesToForm created successfully!");
  Logger.log("The script will now run automatically based on your chosen frequency.");
}

// --- Optional: Function to Manually Delete All Triggers ---
// This function is useful for cleaning up if you want to stop all automated runs
// or reset your triggers completely.
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log("All project triggers deleted.");
}  
