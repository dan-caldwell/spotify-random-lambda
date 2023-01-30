function createContext() {
  let contextValue = undefined;

  function Provider(value, callback) {
    contextValue = value;
    return callback();
  }

  function Consumer() {
    return contextValue;
  }

  function Reset() {
    contextValue = undefined;
  }

  return {
    Provider,
    Consumer,
    Reset,
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
