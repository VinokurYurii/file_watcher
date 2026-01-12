const fs = require("fs/promises");

(async () => {
  const CHANGE_EVENT = "change";
  const FILE_PATH = "./command.txt";
  const CREATE_FILE_COMMAND = "create a file";
  const DELETE_FILE_COMMAND = "delete the file";
  const RENAME_FILE_COMMAND = "rename the file";
  const ADD_TO_FILE_COMMAND = "add to the file";

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
  };

  const deleteFile = async (filePath) => {
    console.log(`deleting <${filePath}>`);
    try {
      await fs.rm(filePath);
    } catch (_e) {
      console.log(`file <${filePath}> doesn't exists`);
    }
  };

  const renameFile = async (oldPath, newPath) => {
    console.log(`renaming from <${oldPath}> to <${newPath}>`);
    try {
      await fs.rename(oldPath, newPath);
    } catch (error) {
      console.error(error.message);
    }
  };

  const addToFile = async (filePath, newContent) => {
    console.log(`adding to file <${filePath}> new content: <${newContent}>`);
    try {
      await fs.appendFile(filePath, `\n${newContent}`);
    } catch (error) {
      console.error(error.message);
    }
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
    content = buffer.toString();

    // create file command:
    // create a file <path>

    if (content.includes(CREATE_FILE_COMMAND)) {
      const filePath = content.substring(CREATE_FILE_COMMAND.length + 1);
      await createFile(filePath);
    }

    // delete file
    // delete the file <path>
    if (content.includes(DELETE_FILE_COMMAND)) {
      const filePath = content.substring(DELETE_FILE_COMMAND.length + 1);
      await deleteFile(filePath);
    }

    // rename file
    // rename the file <path> to <new-path>
    if (content.includes(RENAME_FILE_COMMAND)) {
      const PATH_SEPARATOR = " to ";
      const idx = content.indexOf(PATH_SEPARATOR);
      const oldFilePath = content.substring(
        RENAME_FILE_COMMAND.length + 1,
        idx
      );
      const newFilePath = content.substring(idx + PATH_SEPARATOR.length);
      await renameFile(oldFilePath, newFilePath);
    }

    // add to the file
    // add to the file <path> this content: <content>
    if (content.includes(ADD_TO_FILE_COMMAND)) {
      const CONTENT_SEPARATOR = " this content: ";
      const idx = content.indexOf(CONTENT_SEPARATOR);
      const filePath = content.substring(ADD_TO_FILE_COMMAND.length + 1, idx);
      const newContent = content.substring(idx + CONTENT_SEPARATOR.length);
      await addToFile(filePath, newContent);
    }
  });

  const watcher = fs.watch(FILE_PATH);

  for await (const event of watcher) {
    if (event.eventType === CHANGE_EVENT) {
      commandFileHandler.emit(CHANGE_EVENT);
    }
  }
})();
