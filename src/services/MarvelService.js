import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const timestamp = `ts=1`;
  const hash = "hash=1da3b6bb6bfc1f6b1948dd46f7626027";
  const _apiBase = `https://gateway.marvel.com:443/v1/public/`;
  const _apiKey = "apikey=b21c527666e7784f4b1f86ec0774f8cf";
  const link = `${_apiKey}&${timestamp}&${hash}`;
  const _baseOffset = 210;

  const getAllCharecters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${link}`
    );

    return res.data.results.map(_transformCharacter);
  };

  const getCharecter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${link}`);

    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
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

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      language: comics.textObjects.language || "en-us",
      price: comics.prices.price ? `${comics.prices.price}$` : "not available",
    };
  };

  return {
    loading,
    error,
    clearError,
    getAllCharecters,
    getCharecter,
    getAllComics,
    getComics,
  };
};

export default useMarvelService;
