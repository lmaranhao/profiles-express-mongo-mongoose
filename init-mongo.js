db = db.getSiblingDB('boo');

db.createUser({
  user: 'dbuser',
  pwd: 'dbpassword',
  roles: [{ role: 'readWrite', db: 'boo' }],
});