import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
let CONTACTS = [
  { id: v4(), name: 'John', value: '+7-999-765-21-0', marked: true },
];

const server = express();

server.use(express.json());
server.use(express.static(path.resolve(__dirname, 'app')));

server.get('/api/contacts', (req, res) => {
  try {
    setTimeout(() => {
      res.send(CONTACTS);
    }, 2000);
  } catch (error) {
    console.error(`Cannot get contacts: ${error}`);
  }
});

server.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

server.post('/api/contacts', (req, res) => {
  try {
    const contact = { ...req.body, id: v4(), marked: false };
    CONTACTS.push(contact);
    res.status(201).send(contact);
  } catch (error) {
    console.error(`Cannot send contacts: ${error}`);
  }
});

server.put('/api/contacts/:id', (req, res) => {
  try {
    let contact = CONTACTS.find((contact) => contact.id === req.params.id);
    contact.marked = !contact.marked;
    res.send(contact);
  } catch (error) {
    console.error(`Cannot modify contacts: ${error}`);
  }
});

server.delete('/api/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter((elem) => elem.id !== req.params.id);
  res.send({ message: 'Contacts was deleted successfully' });
});

server.listen(PORT, () => console.log('Server has been started'));
