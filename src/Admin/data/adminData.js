export const orderCategories = [
  "Mens",
  "Womens",
  "Kids",
  "Festive",
  "Daily Deal",
  "Accessories",
];

export const orders = [
  { id: "ORD-1001", customer: "Arun Kumar", phone: "9876543210", address: "Tennur, Trichy", category: "Mens", product: "Cotton Shirt", amount: 1299, status: "Pending", date: "2026-05-09", time: "10:15 AM" },
  { id: "ORD-1002", customer: "Meena R", phone: "9876501234", address: "KK Nagar, Madurai", category: "Womens", product: "Silk Saree", amount: 2499, status: "Packed", date: "2026-05-09", time: "11:40 AM" },
  { id: "ORD-1003", customer: "Kavin S", phone: "9123456780", address: "Srirangam, Trichy", category: "Kids", product: "Kids Combo", amount: 899, status: "Delivered", date: "2026-05-08", time: "02:20 PM" },
  { id: "ORD-1004", customer: "Prakash", phone: "9988776655", address: "Anna Nagar, Madurai", category: "Festive", product: "Festive Kurta", amount: 1799, status: "Packed", date: "2026-05-08", time: "04:05 PM" },
  { id: "ORD-1005", customer: "Divya", phone: "9090909090", address: "Thillai Nagar, Trichy", category: "Daily Deal", product: "Offer Top", amount: 499, status: "Confirmed", date: "2026-05-07", time: "09:55 AM" },
  { id: "ORD-1006", customer: "Siva", phone: "9000011111", address: "Melur, Madurai", category: "Accessories", product: "Leather Belt", amount: 399, status: "Cancelled", date: "2026-05-07", time: "01:10 PM" },
  { id: "ORD-1007", customer: "Nisha", phone: "9444412345", address: "Woraiyur, Trichy", category: "Womens", product: "Kurti", amount: 799, status: "Delivered", date: "2026-05-06", time: "05:35 PM" },
  { id: "ORD-1008", customer: "Ramesh", phone: "9555522222", address: "Tallakulam, Madurai", category: "Mens", product: "Track Pant", amount: 699, status: "Packed", date: "2026-05-06", time: "07:15 PM" },
];

export const categories = [
  { name: "Mens", count: 36, subcategories: ["Shirt", "Pant", "T-Shirt", "Track Pant", "Shorts", "Accessories"] },
  { name: "Womens", count: 42, subcategories: ["Sarees", "Kurtis", "Tops", "Jeans", "Leggings", "Ethnic Wear", "Accessories"] },
  { name: "Kids", count: 24, subcategories: ["Boys Wear", "Girls Wear", "Infant Wear", "Kids Accessories"] },
  { name: "Festive", count: 18, subcategories: ["Silk Sarees", "Kurta Sets", "Family Combo", "Wedding Wear"] },
  { name: "Daily Deal", count: 12, subcategories: ["Mens Deals", "Womens Deals", "Kids Deals", "Accessories Deals"] },
  { name: "Accessories", count: 16, subcategories: ["Mens Accessories", "Womens Accessories", "Kids Accessories"] },
];

export const topProducts = [
  { name: "Mens Cotton Shirt", category: "Mens", price: 1299, stock: 24 },
  { name: "Womens Silk Saree", category: "Womens", price: 2499, stock: 12 },
  { name: "Kids Festive Set", category: "Kids", price: 1199, stock: 18 },
  { name: "Leather Belt", category: "Accessories", price: 399, stock: 34 },
];

export const products = [
  { id: "PRD-101", name: "Mens Cotton Shirt", category: "Mens", subcategory: "Shirt", price: 1299, stock: 24, status: "Active" },
  { id: "PRD-102", name: "Mens Track Pant", category: "Mens", subcategory: "Track Pant", price: 699, stock: 18, status: "Active" },
  { id: "PRD-103", name: "Womens Silk Saree", category: "Womens", subcategory: "Sarees", price: 2499, stock: 12, status: "Active" },
  { id: "PRD-104", name: "Womens Kurti", category: "Womens", subcategory: "Kurtis", price: 799, stock: 28, status: "Active" },
  { id: "PRD-105", name: "Kids Festive Set", category: "Kids", subcategory: "Boys Wear", price: 1199, stock: 16, status: "Active" },
  { id: "PRD-106", name: "Festive Kurta", category: "Festive", subcategory: "Kurta Sets", price: 1799, stock: 9, status: "Low Stock" },
  { id: "PRD-107", name: "Offer Top", category: "Daily Deal", subcategory: "Womens Deals", price: 499, stock: 30, status: "Active" },
  { id: "PRD-108", name: "Leather Belt", category: "Accessories", subcategory: "Mens Accessories", price: 399, stock: 34, status: "Active" },
];

export const users = [
  { id: "USR-001", name: "Arun Kumar", phone: "9876543210", email: "arun@example.com", city: "Trichy", orders: 4, status: "Active" },
  { id: "USR-002", name: "Meena R", phone: "9876501234", email: "meena@example.com", city: "Madurai", orders: 6, status: "Active" },
  { id: "USR-003", name: "Kavin S", phone: "9123456780", email: "kavin@example.com", city: "Trichy", orders: 2, status: "New" },
  { id: "USR-004", name: "Divya", phone: "9090909090", email: "divya@example.com", city: "Trichy", orders: 3, status: "Active" },
];

export const videoCalls = [
  { id: "VC-101", name: "Nisha", phone: "9444412345", category: "Womens", date: "2026-05-10", time: "11:00 AM", status: "Scheduled" },
  { id: "VC-102", name: "Ramesh", phone: "9555522222", category: "Mens", date: "2026-05-10", time: "03:30 PM", status: "Pending" },
  { id: "VC-103", name: "Meena R", phone: "9876501234", category: "Festive", date: "2026-05-11", time: "12:15 PM", status: "Completed" },
  { id: "VC-104", name: "Siva", phone: "9000011111", category: "Accessories", date: "2026-05-11", time: "05:45 PM", status: "Scheduled" },
];

export const enquiries = [
  { id: "ENQ-201", name: "Prakash", phone: "9988776655", category: "Mens Wear", message: "Need shirt size details", date: "2026-05-09", status: "Open" },
  { id: "ENQ-202", name: "Divya", phone: "9090909090", category: "Silk Sarees", message: "Wedding saree collection details", date: "2026-05-09", status: "Replied" },
  { id: "ENQ-203", name: "Kavin S", phone: "9123456780", category: "Kids Collection", message: "Kids festive combo available?", date: "2026-05-08", status: "Open" },
  { id: "ENQ-204", name: "Arun Kumar", phone: "9876543210", category: "Tailoring Service", message: "Alteration timing needed", date: "2026-05-08", status: "Closed" },
];
