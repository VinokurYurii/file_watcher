const fs = require("fs/promises");

(async () => {
  const CHANGE_EVENT = "change";
  const FILE_PATH = "./command.txt";
  const CREATE_FILE_COMMAND = "create a file";

  const createFile = async (path) => {
    let fileHandler;
    try {
      fileHandler = await fs.open(path, "r");
      return console.log(`The file ${path} already exists.`);
    } catch (_e) {
      fileHandler = await fs.open(path, "w");
    } finally {
      fileHandler.close();
    }

    // fs.writeFile(path, Buffer.from("Hello Node.js"));
  };

  const commandFileHandler = await fs.open(FILE_PATH, "r");

  commandFileHandler.on(CHANGE_EVENT, async () => {
    // get the file size info
    const fileSize = (await commandFileHandler.stat()).size;

    const buffer = Buffer.allocUnsafe(fileSize);
    const ofset = 0;
    const length = fileSize;
    const position = 0;

    await commandFileHandler.read(buffer, ofset, length, position);
    // console.log(buffer.toString());
    content = buffer.toString();

    // create file command:
    // create a file <path>

    if (content.includes(CREATE_FILE_COMMAND)) {
      const filePath = content.substring(CREATE_FILE_COMMAND.length + 1);
      console.log(filePath);
      await createFile(filePath);
    }
  });

  const watcher = fs.watch(FILE_PATH);

  for await (const event of watcher) {
    if (event.eventType === CHANGE_EVENT) {
      commandFileHandler.emit(CHANGE_EVENT);
    }
  }
})();
