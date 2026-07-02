const express = require('express'); 
const mysql = require('mysql2'); 
const app = express(); 
 
// Create MySQL connection 
const connection = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: 'RP738964$', 
    database: 'c237_studentlistapp' 
}); 
 
connection.connect((err) => { 
    if (err) { 
        console.error('Error connecting to MySQL:', err); 
        return; 
    } 
    console.log('Connected to MySQL database'); 
}); 
 
// Set up view engine 
app.set('view engine', 'ejs'); 
//  enable static files 
app.use(express.static('public')); 
// enable form processing
app.use(express.urlencoded({ extended: false }));
 
// Define routes 
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving products'); 
    }
   // Render HTML page with data
   res.render('index', { products: results });
  });
});
 
app.get('/product/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [productId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving product by ID'); 
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('product', { product: results[0] });
    } else {
      // If no product with the given ID was found
      res.send('Product not found');
    }
  });
});

app.get('/addStudent', (req, res) => {
  res.render('addStudent'); 
});
app.post('/addStudent', (req, res) => {
  // Extract student data from the request body
  const { name, quantity, price, image } = req.body;
  const sql = 'INSERT INTO students (studentName, quantity, price, image) VALUES (?,?,?,?)';
  // Insert the new student into the database
  connection.query( sql , [name, quantity, price, image], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error adding student:", error);
      res.send('Error adding student');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));