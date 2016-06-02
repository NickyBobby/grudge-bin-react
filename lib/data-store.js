const EventEmitter = require('events');

let grudges = [];

const store = new EventEmitter();

store.create = ({ person, reason }) => {
  grudges = grudges.concat({ person, reason, status: "unforgiven", id: Date.now() });
  store.emit('change', grudges);
};

store.all = () => {
  const storedGrudges = localStorage.getItem('grudges');
  if (storedGrudges) { grudges = JSON.parse(storedGrudges); }
  return grudges.concat([]);
};

store.update = (id, data) => {
  grudges = grudges.map(grudge => {
    if (grudge.id !== id) { return grudge; }
    return Object.assign(grudge, data);
  });
  store.emit('change', grudges);
};

store.filterGrudges = (search) => {
  const filtered = store.all().filter(function(grudge) {
    return grudge.person.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
           grudge.reason.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });
  store.emit('change', filtered);
};

store.on('change', () => {
  localStorage.setItem('grudges', JSON.stringify(grudges));
});

module.exports = store;
