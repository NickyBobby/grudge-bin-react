const EventEmitter = require('events');

// Start out with an empty array to store ideas.
let grudges = [];

// Create a store object that can emit events.
const store = new EventEmitter();

// Check localStorage to see if we have any notes saves from last time.
const storedGrudges = localStorage.getItem('grudges');
if (storedGrudges) { grudges = JSON.parse(storedGrudges); }

store.all = () => grudges.concat([]);

store.create = ({ person, reason }) => {
  grudges = grudges.concat({ person, reason, active: false, id: Date.now() });
  store.emit('change', grudges);
};

store.destroy = (id) => {
  grudges = grudges.filter(grudge => grudge.id !== id);
  store.emit('change', grudges);
};

store.update = (id, data) => {
  grudges = grudges.map(grudge => {
    if (grudge.id !== id) { return grudge; }
    return Object.assign(grudge, data);
  });
  store.emit('change', grudges);
};

store.forgive = (id) => {
  grudges = grudges.map(grudge => Object.assign(grudge, { forgiven: grudge.id === id }));
  store.emit('change', grudges);
};

store.unforgive = () => {
  grudges = grudges.map(grudge => Object.assign(grudge, { forgiven: false }));
  store.emit('change', grudges);
};

store.on('change', () => {
  localStorage.setItem('grudges', JSON.stringify(grudges));
});

module.exports = store;
