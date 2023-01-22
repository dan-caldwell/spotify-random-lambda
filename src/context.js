function createContext() {
  let contextValue = undefined;

  function Provider(value, callback) {
    contextValue = value;
    return callback();
  }

  function Consumer() {
    return contextValue;
  }

  return {
    Provider,
    Consumer,
  }
}

function useContext(ctxRef) {
  return ctxRef.Consumer();
}

module.exports = {
  createContext,
  useContext,
  SpotifyAPIContext: createContext(),
}
