const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "data");
const reviews_data = JSON.parse(fs.readFileSync(path.join(dataDir, "reviews.json"), 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync(path.join(dataDir, "dealerships.json"), 'utf8'));

const reviews = Array.from(reviews_data.reviews || []);
const dealerships = Array.from(dealerships_data.dealerships || []);


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  res.json(reviews);
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  const dealerReviews = reviews.filter((review) => review.dealership === dealerId);
  res.json(dealerReviews);
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  res.json(dealerships);
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  const stateParam = req.params.state;
  if (stateParam.toLowerCase() === "all") {
    res.json(dealerships);
    return;
  }
  const stateFiltered = dealerships.filter((dealer) => (
    dealer.state.toLowerCase() === stateParam.toLowerCase()
    || (dealer.st && dealer.st.toLowerCase() === stateParam.toLowerCase())
  ));
  res.json(stateFiltered);
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  const dealerId = Number(req.params.id);
  const dealer = dealerships.filter((item) => item.id === dealerId);
  res.json(dealer);
});

//Express route to insert review
app.post('/insert_review', async (req, res) => {
  const data = req.body || {};
  const lastId = reviews.length > 0 ? Math.max(...reviews.map((review) => review.id)) : 0;
  const new_id = lastId + 1;

  const review = {
    "id": new_id,
    "name": data['name'],
    "dealership": Number(data['dealership']),
    "review": data['review'],
    "purchase": Boolean(data['purchase']),
    "purchase_date": data['purchase_date'],
    "car_make": data['car_make'],
    "car_model": data['car_model'],
    "car_year": Number(data['car_year']),
  };

  reviews.push(review);
  res.json(review);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
