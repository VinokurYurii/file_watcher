const fs = require("fs/promises");

const CHANGE_EVENT = "change";
const FILE_PATH = "./command.txt";

(async () => {
  const commandFileHandler = await fs.open(FILE_PATH, "r");

  commandFileHandler.on(CHANGE_EVENT, async () => {
    // get the file size info
    const fileSize = (await commandFileHandler.stat()).size;

    const buffer = Buffer.allocUnsafe(fileSize);
    const ofset = 0;
    const length = fileSize;
    const position = 0;

    await commandFileHandler.read(buffer, ofset, length, position);
    console.log(buffer.toString());
  });

  const watcher = fs.watch(FILE_PATH);

  for await (const event of watcher) {
    if (event.eventType === CHANGE_EVENT) {
      commandFileHandler.emit(CHANGE_EVENT);
    }
  }
})();
