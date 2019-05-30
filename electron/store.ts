import Store from 'electron-store';

const defaults = {
  offset: {}
};

export const store = new Store({ defaults });
