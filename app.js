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
  // Alias DB columns (name, dob) to match the field names used in the EJS views (studentName, dateOfBirth)
  const sql = "SELECT studentId, name AS studentName, DATE_FORMAT(dob, '%Y-%m-%d') AS dateOfBirth, contact, image FROM student";
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving student'); 
    }
   // Render HTML page with data
   res.render('index', { students: results });
  });
});
 
app.get('/student/:id', (req, res) => {
  // Extract the student ID from the request parameters
  const studentId = req.params.id;
  const sql = "SELECT studentId, name AS studentName, DATE_FORMAT(dob, '%Y-%m-%d') AS dateOfBirth, contact, image FROM student WHERE studentId = ?";
  // Fetch data from MySQL based on the student ID
  connection.query( sql , [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving student by ID'); 
    }
    // Check if any student with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the student data
      res.render('student', { student: results[0] });
    } else {
      // If no student with the given ID was found
      res.send('Student not found');
    }
  });
});

app.get('/addStudent', (req, res) => {
  res.render('addStudent'); 
});
app.post('/addStudent', (req, res) => {
  // Extract student data from the request body (matches addStudent.ejs form field names)
  const { name, dob, contact, image } = req.body;
  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?,?,?,?)';
  // Insert the new student into the database
  connection.query( sql , [name, dob, contact, image], (error, results) => {
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

app.get('/editProduct/:id', (req,res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [productId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error retrieving product by ID'); 
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('editProduct', { product: results[0] });
    } else {
      // If no product with the given ID was found, render a 404 page or handle it accordingly
      res.send('Product not found');
    }
  });
});

// Add a route in app.js to delete a product from the database.
app.get('/deleteProduct/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE productId = ?';
  connection.query( sql , [productId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error deleting product:", error);
      res.send('Error deleting product');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

app.post('/editProduct/:id', (req, res) => {
  const productId = req.params.id;
  // Extract product data from the request body
  const { name, quantity, price } = req.body;
  const sql = 'UPDATE products SET productName = ? , quantity = ?, price = ? WHERE productId = ?';
  // Insert the new product into the database
  connection.query( sql , [name, quantity, price, productId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error updating product:", error);
      res.send('Error updating product');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));