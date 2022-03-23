class MarvelService {
  timestamp = `ts=1`;
  hash = "hash=1da3b6bb6bfc1f6b1948dd46f7626027";
  _apiBase = `https://gateway.marvel.com:443/v1/public/`;
  _apiKey = "apikey=b21c527666e7784f4b1f86ec0774f8cf";
  link = `${this._apiKey}&${this.timestamp}&${this.hash}`;
  _baseOffset = 210;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`could not fetch ${url}, status:${res.status}`);
    }
    return await res.json();
  };

  getAllCharecters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this.link}`
    );

    return res.data.results.map(this._transformCharacter);
  };

  getCharecter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this.link}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : `There is no description for this character`,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      hompage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
