import IPhrase from "../Interfaces/IPhrase";

export default class PhraseController {
  model: IPhrase;
  defaultLang: string = "en";

  constructor({ phraseModel }: { phraseModel: IPhrase }) {
    this.model = phraseModel;
  }

  get = async (req: any, res: any) => {
    try {
      const { lang = this.defaultLang } = req.params;
      const phrase = await this.model.get({ lang });
      return res.status(200).send(JSON.stringify({ phrase, lang }));
    } catch (e) {
      res.status(400).send("Error getting phrase");
    }
  };
}
