const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const app = express();

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require('cors')());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/analytic', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;