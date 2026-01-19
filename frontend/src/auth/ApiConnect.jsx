import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL  || "https://api.smartdhobi.in/api";

const userData = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const userId = userData ? userData._id : null;
export const role = userData ? userData.role : null;
export const mainUserId = localStorage.getItem("mainUserId")
  ? localStorage.getItem("mainUserId")
  : userId;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const registreDhobi = async (newVendor) => {
  try {
    // Initialize pricing as an empty object
    newVendor.pricing = {};

    // Convert services to pricing object
    newVendor.services.forEach((service) => {
      const serviceName = service.name.toLowerCase();
      const price = parseFloat(service.price.replace(/[^0-9.]/g, ""));
      newVendor.pricing[serviceName] = price;
    });

    const response = await axios.post(
      `${API_BASE_URL}/providers/create`,
      newVendor
    );
    return response;
  } catch (err) {
    console.error("Error adding vendor:", err);
    // alert("Failed to add vendor. Please try again.");
  }
};

//get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

//get all dhobis

export const getAllDhobis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/providers`);
    return response.data.providers;
  } catch (error) {
    console.error("Error fetching dhobis:", error);
    throw error;
  }
};

// fetchDhobiById
export const fetchDhobiById = async (dhobiId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/providers/profile/${dhobiId}`
    );
    return response.data.provider;
  } catch (error) {
    console.error("Error fetching dhobi by ID:", error);
    throw error;
  }
};

//saveorder

export const saveOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/create`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.order;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

//getOrderById

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data.order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

// getuser orders

export const userOrders = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/userOrders/${userId}`
    );
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// getDhobiOrders
export const getDhobiOrder = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/dhobiOrders/${userId}`
    );
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching dhobi orders:", error);
    throw error;
  }
};
// getAllOrders
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/getAllOrders`);
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching dhobi orders:", error);
    throw error;
  }
};
export const getOrderManagment = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/orderManagement`);
    // Return both summary and orders as received from backend
    return {
      summary: response.data.summary,
      orders: response.data.orders,
    };
  } catch (error) {
    console.error("Error fetching dhobi orders:", error);
    throw error;
  }
};

// updateOrderByOrderId

export const updateOrderByOrderId = async (orderId, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/orders/${orderId}/status`,
      {
        status,
      }
    );

    return response.data.order;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

//handleNotificationClick

export const updateNotificationClick = async (noti) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_APP_BASE_URL}/notification/${noti._id}/read`,
      {
        isRead: true,
      }
    );
    fetchNotifications();
  } catch (err) {
    console.error("Failed to mark notification as read", err);
  }
};

export const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/notification/${userId}`
      );
      return res.data || [];
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };


//razorpay payment

export const createRazorpayOrder = async (order) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/orders/create-razorpay-order`,
      {
        orderId: order.orderId,
        amount: order.amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { razorpayOrderId, key } = response.data;
    return { razorpayOrderId, key };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};


//success payment

  export const verifyPaymentSuccess = async (order, response) => {
    try {
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/verify-payment`,
        {
          orderId: order.orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = verifyResponse.data;
      return result;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };


  //admin dashboard data
export const getAdminDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
}