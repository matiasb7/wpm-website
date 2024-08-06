import IPhrase, { languagesType } from "../Interfaces/IPhrase";
import fs from "fs/promises";
import path from "path";

export default class PhraseLocal implements IPhrase {
  dataPath = path.join(__dirname, "..", "data", "phrases");

  get = async ({ lang }: { lang?: languagesType }) => {
    const filePath = path.join(this.dataPath, `${lang}.json`);

    try {
      // await fs.access(filePath);
      // const data = await fs.readFile(filePath, "utf8");
      // const jsonData = JSON.parse(data);
      // const randomIndex = Math.floor(Math.random() * jsonData.length);
      // return jsonData[randomIndex];
      return "daaaa";
    } catch (err) {
      console.error("Error reading or parsing the file:", err);
      return null;
    }
  };
}
