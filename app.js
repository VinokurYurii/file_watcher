const fs = require("fs/promises");

const CCHANGE_EVENt = "change";

(async () => {
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === CCHANGE_EVENt) {
    }
    console.log("The file was changed");
  }
})();
