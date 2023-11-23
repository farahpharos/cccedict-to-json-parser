import fs from "fs/promises";

const cedictFile = "your file path";
const outputFile = "cedict.json"; // output file name

/**
 * Class representing an entry in the dictionary.
 */
class Entry {
  constructor(
    public traditional: string,
    public simplified: string,
    public pinyin: string,
    public definitions: string[]
  ) {}
}

/**
 * Parses a line in the CEDICT file and returns an Entry object.
 * @param entry A correctly formatted CEDICT entry.
 * @returns An Entry object.
 */

function parseEntry(entry: string): Entry | null {
  const regex = /^(.*?) (.*?) \[(.*?)\] \/([^\/]*)\//;
  const match = entry.match(regex);

  if (!match) {
    console.log("Invalid entry: " + entry);
    return null;
  }

  const [, traditional, simplified, pinyin, rawDefinitions] = match;
  const definitions = rawDefinitions.split("/").filter(Boolean);

  return new Entry(traditional, simplified, pinyin, definitions);
}

async function processCEDICTFile() {
  try {
    console.log("Reading from file '" + cedictFile + "'...");
    const data = await fs.readFile(cedictFile, "utf-8");
    const lines = data.split("\n");
    const entryArray: Entry[] = [];

    for (const line of lines) {
      if (line.charAt(0) !== "#") {
        const entry = parseEntry(line);
        if (entry !== null) {
          entryArray.push(entry);
        }
      }
    }

    if (entryArray.length === 0) {
      console.log("No valid entries found. Exiting...");
      return;
    }

    console.log("Writing to file '" + outputFile + "'...");
    const entryData = JSON.stringify(entryArray);

    await fs.writeFile(outputFile, entryData);

    console.log("Completed: " + entryArray.length + " entries written.");
  } catch (err) {
    console.error("Error:", err.message);
    console.error("Stack trace:", err.stack);
  }
}

export default processCEDICTFile;
