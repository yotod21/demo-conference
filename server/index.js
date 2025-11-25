require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Sequelize setup
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME || 'conference_db', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Models
const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'upcoming' },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  registration_start_date: { type: DataTypes.DATE },
  registration_end_date: { type: DataTypes.DATE },
  location: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  available_seat: { type: DataTypes.INTEGER }
});

const Attendee = sequelize.define('Attendee', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING }
});

const Speaker = sequelize.define('Speaker', {
  fullname: { type: DataTypes.STRING, allowNull: false },
  organization: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING }
});

const Sponsor = sequelize.define('Sponsor', {
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING }
});

const Schedule = sequelize.define('Schedule', {
  title: { type: DataTypes.STRING, allowNull: false },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
  location: { type: DataTypes.STRING }
});

// Associations
Event.hasMany(Schedule, { onDelete: 'CASCADE' });
Schedule.belongsTo(Event);
Event.hasMany(Attendee, { onDelete: 'CASCADE' });
Attendee.belongsTo(Event);
Event.hasMany(Speaker, { onDelete: 'CASCADE' });
Speaker.belongsTo(Event);
Event.hasMany(Sponsor, { onDelete: 'CASCADE' });
Sponsor.belongsTo(Event);

// Sync DB
sequelize.sync({ alter: true }).then(() => {
  console.log('Models synced.');
}).catch(err => console.error('Sync error', err));

// CRUD helper
function makeCrud(router, Model, name){
  router.get('/', async (req, res) => {
    const items = await Model.findAll();
    res.json(items);
  });
  router.get('/:id', async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if(!item) return res.status(404).json({message: name + ' not found'});
    res.json(item);
  });
  router.post('/', async (req, res) => {
    const it = await Model.create(req.body);
    res.status(201).json(it);
  });
  router.put('/:id', async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if(!item) return res.status(404).json({message: name + ' not found'});
    await item.update(req.body);
    res.json(item);
  });
  router.delete('/:id', async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if(!item) return res.status(404).json({message: name + ' not found'});
    await item.destroy();
    res.json({message: name + ' deleted'});
  });
}

const eventRouter = express.Router(); makeCrud(eventRouter, Event, 'Event'); app.use('/api/events', eventRouter);
const attendeeRouter = express.Router(); makeCrud(attendeeRouter, Attendee, 'Attendee'); app.use('/api/attendees', attendeeRouter);
const speakerRouter = express.Router(); makeCrud(speakerRouter, Speaker, 'Speaker'); app.use('/api/speakers', speakerRouter);
const sponsorRouter = express.Router(); makeCrud(sponsorRouter, Sponsor, 'Sponsor'); app.use('/api/sponsors', sponsorRouter);
const scheduleRouter = express.Router(); makeCrud(scheduleRouter, Schedule, 'Schedule'); app.use('/api/schedules', scheduleRouter);

// Event-scoped collections
app.get('/api/events/:eventId/attendees', async (req, res) => {
  const attendees = await Attendee.findAll({ where: { EventId: req.params.eventId } });
  res.json(attendees);
});
app.post('/api/events/:eventId/attendees', async (req, res) => {
  try {
    const attendee = await Attendee.create({ ...req.body, EventId: req.params.eventId });
    res.status(201).json(attendee);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/events/:eventId/speakers', async (req, res) => {
  const items = await Speaker.findAll({ where: { EventId: req.params.eventId } });
  res.json(items);
});
app.post('/api/events/:eventId/speakers', async (req, res) => {
  try {
    const item = await Speaker.create({ ...req.body, EventId: req.params.eventId });
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/events/:eventId/sponsors', async (req, res) => {
  const items = await Sponsor.findAll({ where: { EventId: req.params.eventId } });
  res.json(items);
});
app.post('/api/events/:eventId/sponsors', async (req, res) => {
  try {
    const item = await Sponsor.create({ ...req.body, EventId: req.params.eventId });
    res.status(201).json(item);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Export attendees CSV per event
app.get('/api/events/:eventId/attendees/export', async (req, res) => {
  const attendees = await Attendee.findAll({ where: { EventId: req.params.eventId } });
  const header = 'id,name,email,company\n';
  const rows = attendees.map(a => [a.id, a.name ?? '', a.email ?? '', a.company ?? ''].map(v => `"${String(v).replaceAll('"','\"')}"`).join(',')).join('\n');
  const csv = header + rows + '\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="event-${req.params.eventId}-attendees.csv"`);
  res.send(csv);
});

// Serve static client build if exists
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});


// DB test route
const pool = require('./db');
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json({ message: 'Connected to DB (test)', now: rows[0].now });
  } catch (err) {
    console.error('DB test error', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
