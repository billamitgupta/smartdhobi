const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const { initSocket } = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET INITIALIZATION
========================= */
initSocket(server);

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:1100",
      "http://62.72.12.162:1100",

      "https://leafkaart.com",
      "https://www.leafkaart.com",
      "https://api.leafkaart.com",

      "https://leafkaart.cloud",
      "https://www.leafkaart.cloud",
      "https://api.leafkaart.cloud"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/uploads", express.static("uploads"));

/* =========================
   DATABASE & CLOUDINARY
========================= */
database.connectDb();
cloudinaryConnect();

/* =========================
   ROUTES
========================= */

// AUTH
const authRoutes = require("./routes/authRoutes");

// ADMIN ROUTES
const adminEmployeeRoutes = require("./routes/adminRoutes/adminEmployeeRoutes");
const adminDealerRoutes = require("./routes/adminRoutes/adminDealerRoutes");
const adminProductRoutes = require("./routes/adminRoutes/adminProductRoutes");
const adminCategoryRoutes = require("./routes/adminRoutes/adminCategoryRoutes");
const adminSubCategoryRoutes = require("./routes/adminRoutes/adminSubCategoryRoutes");
const adminDashboardRoutes = require("./routes/adminRoutes/adminDashboardRoutes");
const adminOrderRoutes = require("./routes/adminRoutes/adminOrderRoutes");

// EMPLOYEE ROUTES
const employeeProductRoutes = require("./routes/employeeRoutes/employeeProductRoutes");
const employeeOrderRoutes = require("./routes/employeeRoutes/employeeOrderRoutes");

// DEALER ROUTES
const dealerProductRoutes = require("./routes/dealerRoutes/dealerProductRoutes");
const dealerOrderRoutes = require("./routes/dealerRoutes/dealerOrderRoutes");

// CUSTOMER ROUTES
const productRoutes = require("./routes/customerRoutes/productRoutes");
const cartRoutes = require("./routes/customerRoutes/cartRoutes");
const wishlistRoutes = require("./routes/customerRoutes/wishlistRoutes");
const addressRoutes = require("./routes/customerRoutes/addressRoutes");
const orderRoutes = require("./routes/customerRoutes/orderRoutes");
const reviewRoutes = require("./routes/customerRoutes/reviewRoutes");

// COMMON
const notificationRoutes = require("./routes/notificationRoutes");
const bannerRoutes = require("./routes/adminRoutes/adminBannerRoutes");

/* =========================
   ROUTE MAPPINGS
========================= */
app.use("/api/auth", authRoutes);

app.use("/api/admin/employees", adminEmployeeRoutes);
app.use("/api/admin/dealers", adminDealerRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/subCategories", adminSubCategoryRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/employee/products", employeeProductRoutes);
app.use("/api/employee/orders", employeeOrderRoutes);

app.use("/api/dealer/products", dealerProductRoutes);
app.use("/api/dealer/orders", dealerOrderRoutes);

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/banner", bannerRoutes);

/* =========================
   DEFAULT ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Welcome to Leaf E-Commerce App API 🚀");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
